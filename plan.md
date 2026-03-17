1. **Understand the Goal**: The user wants to add navigation items for "Comments on blogs" and "Reviews on books" to the admin navigation bar. Additionally, I need to work on the mobile layout in the admin place for adding and editing books (which seems to imply improving the responsiveness of `BookForm.tsx` or `Books.tsx` for mobile).
2. **Current State**:
   - Navigation links are in `src/components/AdminSidebar.tsx`.
   - `AdminComments` page is available at `/admin/comments` (`src/pages/admin/Comments.tsx`).
   - `AdminReviews` page is available at `/admin/reviews` (`src/pages/admin/Reviews.tsx`).
   - Adding/Editing books is done in `src/components/admin/BookForm.tsx`.
3. **Actions**:
   - Update `src/components/AdminSidebar.tsx` to include `Manage Comments` (icon: `MessageCircle`, path: `/admin/comments`) and `Manage Reviews` (icon: `Star`, path: `/admin/reviews`) in the `navItems` array.
   - Investigate the mobile layout of `src/components/admin/BookForm.tsx` and make it more responsive. Let's look at `BookForm.tsx`. It uses a `grid-cols-1 md:grid-cols-2` which is good for mobile. But the actions buttons (`Cancel`, `Save Book`) might be squished, or the modal itself might be hard to use on small screens. Let's examine the `BookForm.tsx` layout and fix any mobile issues.
   - Investigate the mobile layout of `src/pages/admin/Books.tsx`. The table might be overflowing on mobile. Consider wrapping the table in an `overflow-x-auto` container if it isn't already.

Let's double check `Books.tsx` and `BookForm.tsx` mobile layout first.
