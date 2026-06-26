"""
Admin dashboard and admin-only routes for TruthLens.

Admin authentication is based on ADMIN_USERS environment variable
(comma-separated list of usernames).

Routes:
- GET /admin - Admin dashboard (stats + recent detections)
- GET /admin/detections/<id> - View detection details
- POST /admin/detections/<id>/delete - Delete detection (admin only)
"""

import os
from flask import Blueprint, render_template, redirect, url_for, session, flash, request

from functools import wraps
from bson import ObjectId
from bson.errors import InvalidId

from db import users_col, detections_col

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


def is_admin(username: str = None) -> bool:
    """
    Check if a user is an admin by reading ADMIN_USERS from env at runtime.

    Args:
        username: Username to check. If None, uses session username.

    Returns:
        True if user is in ADMIN_USERS env var, False otherwise.
    """
    if username is None:
        username = session.get("username")
    if not username:
        return False
    
    # Read ADMIN_USERS from env at runtime (not at import time)
    raw = os.getenv("ADMIN_USERS", "")
    admins = [u.strip().lower() for u in raw.split(",") if u.strip()]
    current = (username or "").strip().lower()
    
    # Temporary debug prints
    print("[ADMIN DEBUG] raw=", raw, "admins=", admins, "current=", current)
    
    return current in admins


def admin_required(f):
    """Decorator to require admin access for a route."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if "username" not in session:
            return redirect(url_for("login", next=request.path))
        
        # Check admin status at runtime
        current_username = session.get("username", "")
        if not is_admin(current_username):
            flash("Access denied. Admin privileges required.")
            return redirect(url_for("home"))
        
        return f(*args, **kwargs)
    return decorated


@admin_bp.route("/")
def dashboard():
    """
    Admin dashboard showing:
    - 4 summary cards: Total Users, Total Detections, Fake count, Real count
    - Last 20 detections table
    """
    username = session.get("username")
    if not username:
        return redirect(url_for("login", next=request.path))

    if not is_admin(username):
        flash("Access denied. Admins only.")
        return redirect(url_for("home"))

    try:
        # Get all counts
        total_users = users_col.count_documents({})
        total_detections = detections_col.count_documents({})
        fake_count = detections_col.count_documents({"label": "Fake"})
        real_count = detections_col.count_documents({"label": "Real"})

        # Get last 20 detections (newest first by created_at)
        recent_detections = list(
            detections_col.find({})
            .sort("created_at", -1)
            .limit(20)
        )

        # Format detections for template
        formatted_detections = []
        for doc in recent_detections:
            text_or_url = doc.get("text", "") or doc.get("url", "") or "No input"
            formatted_detections.append({
                "id": str(doc.get("_id", "")),
                "user_id": doc.get("user_id", "guest"),
                "label": doc.get("label", ""),
                "confidence": doc.get("confidence", 0.0),
                "created_at": doc.get("created_at", ""),
                "text_snippet": text_or_url[:100],
            })

        return render_template(
            "admin.html",
            total_users=total_users,
            total_detections=total_detections,
            fake_count=fake_count,
            real_count=real_count,
            detections=formatted_detections,
        )

    except Exception as e:
        flash(f"Error loading dashboard: {str(e)}")
        return render_template(
            "admin.html",
            total_users=0,
            total_detections=0,
            fake_count=0,
            real_count=0,
            detections=[],
            error=str(e),
        )


@admin_bp.route("/detections/<detection_id>")
@admin_required
def view_detection(detection_id: str):
    """View detailed information about a specific detection."""
    try:
        obj_id = ObjectId(detection_id)
    except (InvalidId, TypeError):
        flash("Invalid detection ID format.")
        return redirect(url_for("admin.dashboard"))

    try:
        detection = detections_col.find_one({"_id": obj_id})
        if not detection:
            flash("Detection not found.")
            return redirect(url_for("admin.dashboard"))

        # Format for template
        formatted = {
            "id": str(detection.get("_id", "")),
            "user_id": detection.get("user_id", "guest"),
            "text": detection.get("text", ""),
            "image_url": detection.get("image_url", ""),
            "url": detection.get("url", ""),
            "label": detection.get("label", ""),
            "confidence": detection.get("confidence", 0.0),
            "explanation": detection.get("explanation", ""),
            "created_at": detection.get("created_at", ""),
        }

        return render_template("admin_detail.html", detection=formatted)

    except Exception as e:
        flash(f"Error loading detection: {str(e)}")
        return redirect(url_for("admin.dashboard"))


@admin_bp.route("/detections/<detection_id>/delete", methods=["POST"])
@admin_required
def delete_detection(detection_id: str):
    """Delete a detection (admin only)."""
    try:
        obj_id = ObjectId(detection_id)
    except (InvalidId, TypeError):
        flash("Invalid detection ID format.")
        return redirect(url_for("admin.dashboard"))

    try:
        result = detections_col.delete_one({"_id": obj_id})
        if result.deleted_count > 0:
            flash("Detection deleted successfully.")
        else:
            flash("Detection not found.")
    except Exception as e:
        flash(f"Error deleting detection: {str(e)}")

    return redirect(url_for("admin.dashboard"))

