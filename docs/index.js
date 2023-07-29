"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const eta_1 = require("eta");
exports.app = (0, express_1.default)();
const port = 3000;
// Set the views directory for templates
let viewpath = path_1.default.join(__dirname, "views");
// Configure Eta options
const etaOptions = {
    views: viewpath,
    cache: true,
    useWith: true,
};
const eta = new eta_1.Eta(etaOptions);
// Configure Express to use the Eta template engine
exports.app.engine("eta", () => {
    eta.render;
});
exports.app.set("view engine", "eta");
// API URL
const apiUrl = "https://www.boredapi.com/api/activity";
// Function to fetch data from the API
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(apiUrl);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }
    });
}
// Function to generate 10 unique pages
function generatePages() {
    return __awaiter(this, void 0, void 0, function* () {
        const uniqueData = [];
        let count = 0;
        // Function to render a page based on the index
        function renderPage(index) {
            return __awaiter(this, void 0, void 0, function* () {
                if (uniqueData[index]) {
                    // console.log(index," --- ",uniqueData[index])
                    exports.app.get(`/page${index + 1}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        res.send(eta.render("index", { data: uniqueData[index] }));
                    }));
                }
                else {
                    exports.app.get(`/page${index + 1}`, (req, res) => {
                        res.status(500).send("Internal Server Error: Data not available");
                    });
                }
            });
        }
        // Loop to generate unique data and render pages
        while (count < 10) {
            const data = yield fetchData();
            // Check if the fetched data is not null and not already in uniqueData array
            if (data && !uniqueData.some((item) => item.activity === data.activity)) {
                uniqueData.push(data);
                renderPage(count);
                count++;
            }
        }
        // console.log(uniqueData);
    });
}
const rootDir = process.cwd();
// console.log(path.join(rootDir, "public"));
exports.app.use(express_1.default.static(path_1.default.join(rootDir, "public")));
generatePages();
// Start the Express server
exports.app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
