import ect from 'ect-bin'
import * as fs from 'fs'
import { execFile } from 'child_process'

const outFile = 'index.html.zip'

fs.stat(outFile, err => err || fs.unlinkSync(outFile))

execFile(ect, ['-zip', '-9', 'index.html'], err => {
    const stat = fs.statSync(outFile);
    console.log(stat.size);
});