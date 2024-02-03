// Import required modules
const fs = require('fs');
const util = require('util');
const Excel = require('exceljs');
const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');

// Convert PDF to images
async function convertPdfToImages(pdfPath) {
    let opts = {
        format: 'jpeg',
        out_dir: './output/images',
        out_prefix: 'page',
        page: null // Convert all pages
    };

    try {
        await util.promisify(calculateAreasWithPython)(pdfPath, opts);
        console.log('PDF converted to images successfully.');
    } catch (error) {
        console.error('Error converting PDF to images:', error);
    }
}

// Function to run the Python script and get the sum of areas
function calculateAreasWithPython(imagePaths) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['calculate_areas.py', ...imagePaths]);

        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString());
        });

        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

// Function to get image paths from a directory
function getImagePaths(directory) {
    return fs.readdirSync(directory)
        .filter(file => file.endsWith('.jpeg')) // Adjust based on your image format
        .map(file => path.join(directory, file));
}

// Write results to Excel
async function writeResultsToExcel(sumOfAreas, rows) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Areas');

    worksheet.columns = [
        { header: 'Sum of Areas', key: 'sum_of_areas', width: 20 },
        { header: 'Row', key: 'row', width: 10 },
    ];

    worksheet.addRow({ sum_of_areas: sumOfAreas });

    rows.forEach(row => {
        worksheet.addRow({ row });
    });

    try {
        await workbook.xlsx.writeFile('./output/Results.xlsx');
        console.log('Results written to Excel file successfully.');
    } catch (error) {
        console.error('Error writing to Excel file:', error);
    }
}

// Main function to run the process
async function main() {
    const pdfPath = './input/input.pdf';

    await convertPdfToImages(pdfPath);
    const imagePaths = getImagePaths('./output/images');
    const sumOfAreas = await calculateAreasWithPython(imagePaths);
    
    // Call the API to get the rows
    try {
        const response = await axios.post('http://localhost:3000/api/llms', { imagePaths });
        const rows = response.data;
        await writeResultsToExcel(sumOfAreas, rows);
    } catch (error) {
        console.error('Error calling the API:', error);
    }
}

main().catch(console.error);
