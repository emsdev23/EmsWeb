const connect=require('./connect')

exports.invertersdata = async (req, res,next) => {
    try {
      const data = await connect.query("select * from EMSInverterData ORDER BY invertertimestamp DESC LIMIT 100000");
      const response=(JSON.parse(JSON.stringify(result)))
       res.send(response)
    } catch (err) {
      console.log(err);
    }
  };