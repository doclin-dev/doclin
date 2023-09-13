import { exec } from 'child_process';

interface ShellOutput {
    stdout: string;
    stderr: string;
}

export const executeShellCommand = async(cmd: string): Promise<ShellOutput> => {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}