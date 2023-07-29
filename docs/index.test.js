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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("./index");
describe("Server Test", () => {
    // Test the generated pages for valid responses
    it("should render generated pages with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 1; i <= 10; i++) {
            const response = yield (0, supertest_1.default)(index_1.app).get(`/page${i}`);
            expect(response.status).toBe(200);
        }
    }));
    // Test non-existent pages
    it("should respond with 404 status for non-existent pages", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get("/nonexistent");
        expect(response.status).toBe(404);
    }));
    // Test serving static files (e.g., CSS, images)
    it("should serve static files", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get("/style.css");
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toBe("text/css; charset=UTF-8");
    }));
});
