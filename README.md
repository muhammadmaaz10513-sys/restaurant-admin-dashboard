# 👑 Zaiqa Palace - Standalone Restaurant Admin Dashboard

A dedicated, standalone Admin & Operations Portal built with React 19, Tailwind CSS v4, Lucide Icons, and Supabase.

---

## 🚀 Quick Start
1. Open this folder in terminal or double-click `run-admin-portal.bat`.
2. Or run:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5174/` (or current port) in your browser.

---

## 🔐 Admin Login Credentials
- **Email:** `admin@zaiqa.com`
- **Password:** `admin123`

---

## ⚡ Features
1. **Live Customer Orders Management:**
   - Real-time connection to Supabase database (`orders` table).
   - Status changer: Click **Pending**, **Preparing**, or **Delivered** to update live order status in Supabase.
   - Customer phone number with 1-click **Call** and **WhatsApp** chat buttons.
   - 1-click **Copy Receipt** button.
   - Filter by status (`All`, `Pending`, `Preparing`, `Delivered`) and real-time search.

2. **Menu Catalog (View Only):**
   - View all restaurant dishes, categories, prices (PKR), badges, ratings, and prep times.
   - Category filtering & instant search.

3. **Executive Analytics & Revenue:**
   - Total Gross Revenue in PKR.
   - Orders Count breakdown: Pending in Queue, Cooking in Kitchen, Delivered.
   - Average Order Value (AOV).
   - Recent orders stream.

4. **Automated Social Media Scheduler (Part B):**
   - 4-Post automated campaign schedule (3 pictures + 1 reel) at peak Pakistan engagement hours.
   - Master timetable and realistic social media card previews.
