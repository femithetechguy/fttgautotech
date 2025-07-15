# FTTG AutoTech - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Form Submission Issues

#### ❌ **Problem**: Forms not submitting
**Symptoms**: 
- Form button shows "loading" but nothing happens
- No success/error messages
- Console errors

**Solutions**:
1. **Check Formspree form ID**:
   ```html
   <!-- Verify the form action URL -->
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

2. **Check browser console** (F12):
   - Look for JavaScript errors
   - Check network requests
   - Verify API responses

3. **Test with simple form**:
   ```html
   <form action="https://formspree.io/f/manbywaz" method="POST">
     <input type="text" name="test" required>
     <button type="submit">Test Submit</button>
   </form>
   ```

4. **Check Formspree account**:
   - Login to formspree.io
   - Verify form is active
   - Check submission limits

---

#### ❌ **Problem**: Not receiving form emails
**Symptoms**:
- Form submits successfully
- No email notifications received

**Solutions**:
1. **Check spam folder**
2. **Verify Formspree email settings**:
   - Login to Formspree dashboard
   - Check notification settings
   - Verify email address is correct

3. **Test email delivery**:
   - Submit a test form
   - Check Formspree dashboard for submissions
   - Contact Formspree support if needed

---

### Styling Issues

#### ❌ **Problem**: Mobile layout broken
**Symptoms**:
- Text cutoff on mobile
- Buttons too small
- Overlapping elements

**Solutions**:
1. **Check viewport meta tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Verify mobile CSS loading**:
   ```html
   <link rel="stylesheet" href="css/mobile.css">
   ```

3. **Test responsive breakpoints**:
   - Use browser dev tools
   - Test on real devices
   - Check CSS media queries

4. **Common mobile fixes**:
   ```css
   /* Ensure text is readable */
   .mobile-text { font-size: 16px; }
   
   /* Make buttons touch-friendly */
   .mobile-button { min-height: 44px; }
   
   /* Prevent horizontal scroll */
   body { overflow-x: hidden; }
   ```

---

#### ❌ **Problem**: CSS not loading
**Symptoms**:
- Unstyled HTML
- Missing fonts/icons
- Layout issues

**Solutions**:
1. **Check file paths**:
   ```html
   <!-- Ensure correct relative paths -->
   <link rel="stylesheet" href="css/styles.css">
   ```

2. **Clear browser cache**:
   - Hard refresh (Ctrl+F5)
   - Clear browser cache
   - Try incognito mode

3. **Verify file existence**:
   - Check that CSS files exist
   - Verify file names match exactly
   - Check for typos in paths

---

### JavaScript Issues

#### ❌ **Problem**: Interactive features not working
**Symptoms**:
- Menu not opening
- Forms not validating
- Buttons not responding

**Solutions**:
1. **Check console for errors**:
   - Open browser dev tools (F12)
   - Look for red error messages
   - Fix JavaScript syntax errors

2. **Verify script loading**:
   ```html
   <!-- Check all scripts are included -->
   <script src="js/script.js"></script>
   <script src="js/booking.js"></script>
   ```

3. **Common JavaScript fixes**:
   ```javascript
   // Ensure DOM is loaded
   document.addEventListener('DOMContentLoaded', function() {
     // Your code here
   });
   
   // Check if elements exist
   const element = document.getElementById('myElement');
   if (element) {
     // Safe to use element
   }
   ```

---

### Loading Issues

#### ❌ **Problem**: Page loads slowly
**Symptoms**:
- Long loading times
- Images don't appear
- Fonts load late

**Solutions**:
1. **Optimize images**:
   - Compress large images
   - Use appropriate formats (WebP, PNG, JPG)
   - Add `loading="lazy"` for non-critical images

2. **Check CDN resources**:
   ```html
   <!-- Verify external resources load -->
   <link href="https://fonts.googleapis.com/css2?family=Montserrat..." rel="stylesheet">
   <script src="https://cdn.tailwindcss.com"></script>
   ```

3. **Use browser dev tools**:
   - Network tab to see load times
   - Lighthouse for performance audit
   - Check for failed resource loads

---

#### ❌ **Problem**: Content not appearing
**Symptoms**:
- Empty sections
- "Loading..." text persists
- Missing dynamic content

**Solutions**:
1. **Check JSON file loading**:
   ```javascript
   // Verify JSON files are accessible
   fetch('/json/services.json')
     .then(response => response.json())
     .then(data => console.log(data))
     .catch(error => console.error('JSON load failed:', error));
   ```

2. **Verify file paths**:
   - Ensure JSON files exist
   - Check relative paths are correct
   - Test in local server environment

3. **Add fallback content**:
   ```javascript
   // Always provide fallback content
   setTimeout(() => {
     if (element.textContent === 'Loading...') {
       element.textContent = 'Default content';
     }
   }, 5000);
   ```

---

### Browser Compatibility Issues

#### ❌ **Problem**: Site works in Chrome but not other browsers
**Symptoms**:
- Features missing in Safari/Firefox
- Styling differences
- JavaScript errors

**Solutions**:
1. **Check browser support**:
   - Use MDN to verify feature support
   - Add polyfills for missing features
   - Test in multiple browsers

2. **Common compatibility fixes**:
   ```css
   /* Add vendor prefixes */
   .gradient {
     background: -webkit-linear-gradient(left, #color1, #color2);
     background: linear-gradient(to right, #color1, #color2);
   }
   ```

3. **Use feature detection**:
   ```javascript
   // Check if feature exists before using
   if ('fetch' in window) {
     // Use fetch
   } else {
     // Use XMLHttpRequest fallback
   }
   ```

---

### GitHub Pages Specific Issues

#### ❌ **Problem**: Site not updating after push
**Symptoms**:
- Changes not visible on live site
- Old version still showing

**Solutions**:
1. **Check GitHub Actions**:
   - Go to repository Actions tab
   - Look for deployment status
   - Check for build errors

2. **Verify branch settings**:
   - Settings → Pages
   - Ensure correct branch selected
   - Check folder setting (/ root)

3. **Clear cache and wait**:
   - GitHub Pages can take 10 minutes to update
   - Clear browser cache
   - Try different browser/device

---

#### ❌ **Problem**: 404 errors on GitHub Pages
**Symptoms**:
- Links return 404 errors
- Resources not found

**Solutions**:
1. **Check file paths**:
   - Use relative paths, not absolute
   - Ensure case sensitivity (Linux servers)
   - Check file exists in repository

2. **Verify repository structure**:
   ```
   / (root)
   ├── index.html     ✅ Correct
   ├── css/styles.css ✅ Correct
   └── js/script.js   ✅ Correct
   ```

---

### Consent Form Specific Issues

#### ❌ **Problem**: Consent form not working
**Solutions**:
1. **Check form ID**: Verify `manbywaz` is correct Formspree ID
2. **Test JavaScript**: Look for errors in `formspree-consent.js`
3. **Verify validation**: Ensure radio buttons are selected

---

## 🛠️ Debugging Tools

### Browser Developer Tools
- **Console**: JavaScript errors and logs
- **Network**: Resource loading and API calls
- **Elements**: HTML/CSS inspection
- **Lighthouse**: Performance and SEO audit

### Testing Commands
```bash
# Test local server
python -m http.server 8000

# Validate HTML
# Use W3C Markup Validator online

# Check links
# Use online broken link checkers
```

### Useful Console Commands
```javascript
// Check if element exists
document.getElementById('element-id')

// Test form submission
document.querySelector('form').addEventListener('submit', e => console.log('Form submitted'))

// Check for JavaScript errors
window.onerror = function(msg, url, line) { console.log('Error:', msg); }
```

---

## 📞 Getting Help

### Quick Checks Before Asking for Help
1. ✅ Clear browser cache
2. ✅ Check browser console for errors
3. ✅ Test in different browser
4. ✅ Verify all files are uploaded
5. ✅ Check Formspree dashboard

### Support Resources
- **GitHub Pages**: [GitHub Pages Documentation](https://docs.github.com/pages)
- **Formspree**: [Formspree Help Center](https://help.formspree.io)
- **Web Development**: [MDN Web Docs](https://developer.mozilla.org)

### Contact Information
For FTTG AutoTech specific issues:
- **Business Phone**: (855) 578-4334
- **Email**: info@fttgautotech.com

Remember: Most issues can be resolved by checking the browser console and verifying file paths! 🔍
