# Skywings: website + owner admin

START HERE (no experience needed)

## A. Put the website online on Hostinger (about 10 minutes)
1. Log in to hPanel (hpanel.hostinger.com) > Websites > click Manage next to your domain.
2. Open File Manager. Open the folder called public_html. Delete the default files inside it (for example default.php).
3. Click the Upload icon, choose skywings-site.zip, then right-click the zip in the list > Extract.
4. After extracting, you may see a folder called skywings-site inside public_html. Open it, select ALL files and folders
   (index.html, admin.html, firebase-config.js, images), click Move, and move them up into public_html itself.
   index.html must sit directly inside public_html.
5. Open your domain in the browser. The website is live. (If it looks old, press Ctrl+F5.)
   The site works right now without Firebase: packages and the WhatsApp button already work.
   The owner admin needs Firebase (section C), so it will say "Add your Firebase details" until then.

## B. Change the images later
All photos live in the images folder. Upload a JPG with the exact name and it replaces the drawn picture. No code needed.
- images/hero/1.jpg to 6.jpg      the slideshow at the top (1920 x 1100 px)
- images/offers/promo-1.jpg to promo-4.jpg   the changing images in the 20% OFF box
- images/services/couple.jpg, student.jpg, christian.jpg, visa.jpg, tickets.jpg   the service cards (portrait 3:4, 900 x 1200 px)
- images/packages/bali/1.jpg to 6.jpg
  (same for dubai, kyoto, maldives, tokyo, santorini, zermatt, banff, udaipur, goa, manali, kashmir, singapore, holy-land, italy, gothic-europe, velankanni)
  1.jpg is the card photo and the first photo in the popup; 2 to 6 are the swipe photos.
Keep each photo under 300 KB (use squoosh.app to shrink them). Each folder has a PUT-PHOTOS-HERE.txt that lists the names.
New package added in the admin, for example "Goa"? Make the folder images/packages/goa/ (lowercase name) and add 1.jpg to 6.jpg.
To change a photo: in File Manager open the folder, upload the new JPG with the same name, choose Overwrite, press Ctrl+F5.

## C. Turn on the admin and enquiry saving (Firebase). Do this after the site is live.


## 1. Create the Firebase project (free plan is enough)
1. Go to console.firebase.google.com > Add project.
2. Build > Firestore Database > Create database (production mode, pick a region close to you).
3. Build > Authentication > Get started > Sign-in method > turn on Email/Password.
4. Authentication > Users > Add user: your email + a strong password. This is the owner login.
5. Project settings (gear) > General > Your apps > Web (</>) > register app > copy the config.

## 2. Edit firebase-config.js
Paste the config values and set OWNER_EMAIL to the same email you created in step 1.4.

## 3. Paste these Firestore rules (Firestore Database > Rules > Publish)
Replace owner@youremail.com with your owner email.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner() {
      return request.auth != null && request.auth.token.email == "owner@youremail.com";
    }
    match /enquiries/{id} {
      allow create: if request.resource.data.keys().hasOnly(
          ['name','phone','pkg','svc','pax','date','amount','notes','status','src','created'])
        && request.resource.data.status == 'New'
        && request.resource.data.name is string && request.resource.data.name.size() < 100
        && request.resource.data.notes is string && request.resource.data.notes.size() < 1000;
      allow read, update, delete: if isOwner();
    }
    match /packages/{id} { allow read: if true; allow write: if isOwner(); }
    match /settings/{id} { allow read: if true; allow write: if isOwner(); }
  }
}

What this does: visitors can only ADD a new enquiry. Only you can read or change enquiries.
Everyone can read packages and settings (needed to show them on the site). Only you can edit them.

## 4. Upload to your hosting
Upload all 3 files to the same folder (Netlify, Vercel, Firebase Hosting or any web host).
The site must be served over https (not opened as a local file) because it uses ES modules.
- Website:  https://yourdomain.com/
- Admin:    https://yourdomain.com/admin.html  (rename the file if you like; it is set to noindex)
In Firebase: Authentication > Settings > Authorized domains > add your domain.

## 5. First run
Open admin.html, sign in, go to Packages and tap "Load starter packages". After that:
- Edit prices/days/active in Packages and the offer/phone in Site settings. The website picks them up on the next page load.
- Enquiries sent from the website's contact and booking forms appear in Enquiries with status "New".

## Notes
- If Firebase is not configured or is unreachable, the website still works with its built-in packages and the WhatsApp button.
- Do not skip step 3. Without the rules, Firestore is either locked (nothing works) or open (anyone can read enquiries).
- Optional spam protection: turn on Firebase App Check (reCAPTCHA) for Firestore.

## Code map (where to edit what)
- index.html : the page content (text, sections). Each section starts with a label like  <!-- ===== FAQ ===== -->
- style.css  : all the looks. Contents list at the top. Search the number + name, e.g.  06 HERO
               NOTE: later rules override earlier ones. If a change does nothing, edit the LAST matching rule (Layer 4 wins).
- app.js     : all behaviour + the PACKAGE DATA (search  PACKAGE DATA - edit packages here). Contents list at the top.
- firebase-config.js : your Firebase keys. admin.html : owner dashboard.
Upload all of them (index.html, style.css, app.js, firebase-config.js, admin.html, images/) to public_html.
