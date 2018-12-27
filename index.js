const fs = require('fs');
//file system module from nodejs, a core module
const http = require('http');
const url = require('url');


const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);

console.log(__dirname);
console.log(json);
console.log(laptopData);

//

const server = http.createServer((req, res) => {
    //url.parse();
    //console.log(req); parse query into object true
    const pathName = url.parse(req.url, true).pathname;
    //to get id: 4 in query object from url 127.0.0.1:1337/laptop?id=4
    const id = url.parse(req.url, true).query.id;

/**PRODUCT OVERVIEW */
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        //res.end('This is the PRODUCTS!');
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
              
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                //console.log(cardsOutput);    
                overviewOutput = overviewOutput.replace(/{%CARDS%}/g, cardsOutput);
                res.end(overviewOutput)
            });
        });

/**LAPTOP DETAIL */
    } else if (pathName === '/laptop' || id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        // res.end(`This is the LAPTOP for laptop ${id}!`);

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            //data varialbe is template html now, /{%PRODUCTNAME%}/g reg expression to replace all and not just first occurance in html
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output)
        });
    }

    /**images */
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        })
    }
    
/** URL NOT FOUND*/
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL wasnt found on server');
    }
    console.log(pathName);
    //response to browser
    //console.log('someone did access the server');
})
//res.end - 


server.listen(1337, '127.0.0.1', () => {
    console.log('server is listening');
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}