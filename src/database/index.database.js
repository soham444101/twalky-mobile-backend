import mongoose from "mongoose"
import { Database_Name } from "../constant.js"



const ConnectDB = async function () {

  try {
    const connection = mongoose.connect(`${process.env.MOOGO_URL}/${Database_Name}`);
    console.log('====================================');
    console.log("Db Connected !");
    console.log('====================================');
    console.log("Host Name", (await connection).connection.host);

  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }


}
export default ConnectDB