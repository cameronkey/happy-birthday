@@ .. @@
   const handleEnvelopeHover = () => {
     if (stage === 'envelope-drop') {
       setStage('envelope-hover');
       setEnvelopeOpened(true);
       playSound(523, 0.2); // C note
     }
   };
 
   const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
     if (stage === 'envelope-hover') {
       setIsDragging(true);
       playSound(659, 0.1); // E note
     }
   };
 
   const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
     if (!isDragging) return;
     
     const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
     const progress = Math.min(Math.max((clientY - 200) / 200, 0), 1);
     setDragProgress(progress);
     
     if (progress > 0.8) {
       setStage('card-3d');
       setIsDragging(false);
       playSound(783, 0.3); // G note
     }
   };
 
   const handleDragEnd = () => {
     if (isDragging && dragProgress < 0.8) {
       setDragProgress(0);
       setIsDragging(false);
     }
   };
 
   const handleCardClick = () => {
+    // Add haptic feedback
+    if ('vibrate' in navigator) {
+      navigator.vibrate(100);
+    }
     setCardIsOpen(!cardIsOpen);
     playSound(1047, 0.4); // High C
   }
 
   const handleTicketClick = () => {
     if (stage === 'card-3d') {
+      // Add haptic feedback
+      if ('vibrate' in navigator) {
+        navigator.vibrate([50, 25, 50]);
+      }
       setStage('ticket-view');
       playSound(1319, 0.5); // E high
     }
   };
 
   const handleReturnToCard = () => {
     setStage('card-3d');
     playSound(783, 0.3); // G note
   }
 
-  const downloadGift = () => {
+  const downloadGift = async () => {
+    return new Promise<void>((resolve) => {
+      setTimeout(() => {
         // Create a simple gift certificate
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
-        if (!ctx) return;
+        if (!ctx) {
+          resolve();
+          return;
+        }
 
         canvas.width = 800;
         canvas.height = 600;
@@ .. @@
         link.click();
         
         setStage('final');
+        resolve();
+      }, 1000); // Simulate processing time
+    });
   };
 
   const renderContent = () => {