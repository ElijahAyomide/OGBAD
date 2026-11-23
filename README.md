# OGBAD: public site, ready for Netlify

Home page, update page and contact page, with your Buy, Contact and Newsletter forms ready for Netlify Forms.
The admin portal (`/admin/`) is a "coming soon" page for now; it is built in the next step.

## Put it online (about 15 minutes)
1. Copy everything in this folder into your project folder (replace files when asked).
   If you earlier copied the PHP admin version, first delete these from your project: the `admin` folder, the `private` folder and the `.htaccess` file.
2. In VS Code terminal:
       git add -A
       git commit -m "Ready for Netlify"
       git push
3. Go to netlify.com > **Sign up** > choose **Sign up with GitHub**.
4. **Add new project > Import an existing project > GitHub**, allow access, and pick your repository.
5. Leave the build command empty. The publish directory should be `.` (it is already set in `netlify.toml`). Click **Deploy**.
6. When it says published, open **Project configuration > Change project name** and choose a short name. Your link becomes `https://thatname.netlify.app`.

## Get the emails (one notification per form)
1. In Netlify open **Forms**. After the first deploy you should see three forms: `payment-claim`, `contact` and `newsletter`.
2. **Project configuration > Notifications > Emails and webhooks > Add notification > Email notification.**
3. Event: **New form submission**. Form: pick one. Email: your email. Save.
4. Repeat for the other two forms (the same email is fine; the subject shows which form it came from).
(Menu names can change slightly; look for Notifications in the project settings.)

## Test
1. Open your netlify.app link, open an update, click **Buy this update**, fill in your own name and email and click through to **I have made payment**.
2. Check your inbox (and Spam) for the alert. Do the same on the Contact page and the Newsletter box.
3. Don't share the link yet: the updates you see are samples until the admin is built.

## Notes
- The updates are samples from `updates.json`. The admin will replace them with your real ones.
- Bank details shown at checkout are placeholders until the admin lets you change them.
- Netlify's form spam filter is switched on, and each form has a hidden trap field for bots.
