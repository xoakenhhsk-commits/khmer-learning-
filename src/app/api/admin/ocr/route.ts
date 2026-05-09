import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    // Call python script
    const scriptPath = path.join(process.cwd(), "python_ocr", "main.py");
    
    return new Promise((resolve) => {
      const pythonProcess = spawn("python", [scriptPath, imageBase64]);
      
      let dataString = "";
      let errorString = "";

      pythonProcess.stdout.on("data", (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorString += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python OCR Error:", errorString);
          return resolve(NextResponse.json({ success: false, error: "Lỗi chạy Python OCR: " + errorString }, { status: 500 }));
        }

        try {
          // Find JSON in the output
          const jsonMatch = dataString.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            resolve(NextResponse.json(result));
          } else {
            resolve(NextResponse.json({ success: false, error: "Không tìm thấy kết quả hợp lệ từ Python" }, { status: 500 }));
          }
        } catch (e) {
          resolve(NextResponse.json({ success: false, error: "Lỗi parse kết quả từ Python: " + dataString }, { status: 500 }));
        }
      });
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
