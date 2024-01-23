const fs = require("fs")
const path = require("path")

class Database {
        data = {}
        file = path.join(process.cwd(), "temp/database.json")

        read() {
            let data
            if (fs.existsSync(this.file)) {
                data = JSON.parse(fs.readFileSync(this.file))
            } else {
                fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
                data = this.data
            }

            return data
        }

        write(data) {
            this.data = !!data ? data : global.db
            let dirname = path.dirname(this.file)
            if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
            fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
            return this.file
        }
    }

module.exports = Database