import { execSync } from "child_process";

export default function backupDatabase() {
  console.log(execSync("pwd"));
}
