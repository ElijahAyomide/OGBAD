# OGBAD: Step 1 (frontend only)

This step has the two public pages only. There is no admin and no email yet; those come in the next steps.

- `index.html`    Home page
- `contact.html`  Contact page (message form + quick answers)
- `update.html`   Page for one update (opened as `update.html?u=the-update-name`)
- `updates.json`  SAMPLE updates so you can see the pages. Step 2 (the admin) will replace these with your real ones.
- `images/logo.png` your logo. `images/hero.jpg` the home page photo (cropped from your design). `images/samples/` are placeholder pictures only.
- `css/styles.css` colours and fonts are at the top (`:root`). `js/` holds the behaviour.

## See it on your computer
1. Open this folder in VS Code (File > Open Folder).
2. Install the extension **Live Server** (by Ritwick Dey) from the Extensions tab.
3. Right-click `index.html` > **Open with Live Server**. Click an update to open its page and try "Buy this update".
   (Opening the file by double-clicking will not work, because the page loads `updates.json`.)
In this preview the "I have made payment" button does not send an email; it only shows the thank-you message.
The email part is added when the site goes live (Step 3). The contact form works the same way: in preview it only shows the thank-you message.

## Put it on GitHub
In the VS Code terminal:

    git add -A
    git commit -m "Step 1: frontend pages"
    git push

## Where to edit wording
- Page headings and fixed text: `index.html` and `update.html`
- Update titles, prices, categories, descriptions, bank details: `updates.json` (temporary; the admin will do this for you in Step 2)

## The plan
1. Frontend pages (this step), you review and we adjust
2. Admin portal: login, add / edit / delete updates with cover + 4 screen shots, bank details
3. Go live on Netlify + the "I have made payment" email alert
4. Final tests with a real transfer
