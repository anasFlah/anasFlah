#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Renaming Dribbble Images to New Convention...\n');

const imagesDir = path.join(process.cwd(), 'public', 'images');
const oldFiles = [
    'dribble1.jpeg',
    'dribble2.jpeg', 
    'dribble3.jpeg',
    'dribble4.jpeg',
    'dribble5.jpeg',
    'dribble6.jpeg'
];

const newFiles = [
    'creative-work-1.jpg',
    'creative-work-2.jpg',
    'creative-work-3.jpg', 
    'creative-work-4.jpg',
    'creative-work-5.jpg',
    'creative-work-6.jpg'
];

// Check if old files exist and rename them
oldFiles.forEach((oldFile, index) => {
    const oldPath = path.join(imagesDir, oldFile);
    const newPath = path.join(imagesDir, newFiles[index]);
    
    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: ${oldFile} → ${newFiles[index]}`);
        } catch (error) {
            console.error(`❌ Error renaming ${oldFile}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${oldFile}`);
    }
});

console.log('\n🎉 Renaming complete!');
console.log('\n📝 Next steps:');
console.log('1. Replace the renamed files with high-quality industry-relevant images');
console.log('2. Ensure images are optimized for web (under 500KB each)');
console.log('3. Test the animations in your browser');
console.log('\n📖 See DRIBBBLE_IMAGES_GUIDE.md for detailed image specifications');
