const fs = require('fs');

const jsonPath = './images/images.json';
let existingImages = [];

// 1. Intentar leer los títulos que ya escribiste para no borrarlos
if (fs.existsSync(jsonPath)) {
    try {
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const parsed = JSON.parse(rawData);
        if (parsed && Array.isArray(parsed.images)) {
            existingImages = parsed.images;
        }
    } catch (e) {
        console.log("Creando lista desde cero...");
    }
}

fs.readdir('./images', (err, files) => {
    if (err) return console.error(err);

    // Filtrar para que solo lea imágenes
    const imageFiles = files.filter(file => 
        !file.endsWith('.js') && 
        !file.endsWith('.json') && 
        file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    // 2. Armar la lista inteligente
    const list = imageFiles.map(file => {
        // Si la imagen ya existía en tu JSON, dejamos el título que ya le habías puesto
        const match = existingImages.find(img => img.file === file);
        if (match) {
            return match;
        }
        
        // Si es una imagen nueva, le inventamos un título limpio temporal basado en el nombre
        const cleanTitle = file.split('.').slice(0, -1).join('.').replace(/[-_]/g, ' ');
        return {
            title: cleanTitle,
            file: file
        };
    });

    // 3. Guardar el archivo ordenado
    const json = JSON.stringify({ images: list }, null, 4);
    fs.writeFileSync(jsonPath, json);
    console.log("¡Lista actualizada con éxito sin borrar tus títulos!");
});
