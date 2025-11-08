Maintenance page
================

What I changed
--------------

- Replaced the root `index.html` with a simple static maintenance page so visitors see a "We’re taking a short break" message.

Why
---

You asked that when users visit nkwabiz.com they should see a message that the platform is paused while you make updates. This change shows that message immediately without running the React app.

How to revert
-------------

If you want to restore the previous app entrypoint (the React/Vite app), restore `index.html` from git:

```bash
# restore the file to the repository's HEAD version
git restore index.html

# or, if you want to restore from the remote branch 'GO' (if different):
git fetch origin
git checkout origin/GO -- index.html
```

Notes
-----

- This is a content-only change to the static `index.html`. If your deployment uses a CDN or other caching layer, you may need to invalidate the cache or redeploy to make the change visible immediately.
- If you prefer a different visual style or want to add a contact link, I can update the page.
