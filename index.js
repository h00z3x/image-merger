var images = [];
const fs = require('node:fs').promises;
const { createCanvas, loadImage, Image } = require('canvas');

main(images);

/**
 *
 *
 * @param {Image[]} images
 */
async function main(images) {
    const path = await fs.readdir('./images');

    /* 
    
        Sorts the file by the number ^-^
    
    */
    path.sort((a, b) => {

        let value_a = parseInt(a.split("_")[1]);
        let value_b = parseInt(b.split("_")[1]);

        if (value_a > value_b) {
            return 1;
        }
        if (value_a < value_b) {
            return -1;
        }
        return 0;
    });


    for (i in path) {
        let image = await loadImage(await fs.readFile(`./images/${path[i]}`));
        images.push(image);
    }

    var folder = path[0].split("_")[0];
    fs.mkdir(folder);

    if (images.length > 0) {
        const chunkSize = 30;
        const chunks = [];

        for (let i = 0; i < images.length; i += chunkSize) {
            const chunk = images.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        for (i in chunks) {
            try {
                var images = chunks[i];
                var width = 0;
                var height = 0;

                for (let i = 0; i < images.length; i++) {
                    width = Math.max(width, images[i].width);
                    height += images[i].height;
                }
                console.log(`Creating image - ${i} with the height of ${height}`);
                var canvas = createCanvas(width, height);

                var ctx = canvas.getContext('2d');
                var top = 0;

                for (let i = 0; i < images.length; i++) {
                    ctx.drawImage(images[i], 0, top);
                    top += images[i].height;
                }
                const img = canvas.toDataURL();
                const data = img.replace(/^data:image\/\w+;base64,/, "");
                const buf = Buffer.from(data, "base64");

                await fs.writeFile(`${folder}/${i}.png`, buf);
            }
            catch (e) {
                console.log(e);
            }
        }

        path.map((value) => {
            fs.unlink(`./images/${value}`);
        })
    }
}