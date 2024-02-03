// Import required modules
const fs = require('fs');
const util = require('util');
const Excel = require('exceljs');
const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');

// Function to run the Python script and get the sum of areas
function calculateAreasWithPython(imagePaths) {
        const pythonProcess = spawn('python', ['calculation.py', ...imagePaths]);

        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString());
        });

        pythonProcess.stderr.on('data', (data) => {
            console.log(data.toString());
        });
}

async function convertPdfToImages() {
    console.log('1');
        const pythonProcess = spawn('python', ['convertPdfToImages.py', './input/input.pdf']);

        pythonProcess.stdout.on('data', (data) => {
            console.log(data.toString());
            resolve();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(data.toString());
            reject();
        });
}

// Function to get image paths from a directory
function getImagePaths(directory) {
    return fs.readdirSync(directory)
        .filter(file => file.endsWith('.jpg'))
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
    const imagePaths = getImagePaths('./input/output/');
    console.log(imagePaths);
    const sumOfAreas = await calculateAreasWithPython(imagePaths);
    console.log('0');
    
}

main().catch(console.error);
