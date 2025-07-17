@@ .. @@
 /** @type {import('tailwindcss').Config} */
 export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
-    extend: {},
+    extend: {
+      screens: {
+        'xs': '475px',
+      },
+      animation: {
+        'fade-in': 'fade-in 0.8s ease-out',
+        'card-peek': 'card-peek 0.8s ease-out',
+        'envelope-drop': 'envelope-drop 1.5s ease-out',
+        'ticket-appear': 'ticket-appear 1.5s ease-out',
+      },
+    },
   },
   plugins: [],
 };