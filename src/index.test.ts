import request from "supertest";
import {app} from "./index";

describe("Server Test", () => {

  // Test the generated pages for valid responses
  it("should render generated pages with valid data", async () => {
    for (let i = 1; i <= 10; i++) {
      const response = await request(app).get(`/page${i}`);
      expect(response.status).toBe(200);
    }
  });

  // Test non-existent pages
  it("should respond with 404 status for non-existent pages", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.status).toBe(404);
  });

  // Test serving static files (e.g., CSS, images)
  it("should serve static files", async () => {
    const response = await request(app).get("/style.css");
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("text/css; charset=UTF-8");
  });
});
