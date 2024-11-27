from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
import fitz  # PyMuPDF
from dotenv import load_dotenv
# Ensure that you've installed and are importing the correct google package
import google.generativeai as genai  

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)  # Ensure this is the correct way to configure the API

# Define prompts as constants
PROMPTS = {
    'about_resume': "Give back the parsed data from resume in organised form and remove asterisk sign if it's heading then give it in capital letters and if this is table then provide it in a table form",
    'improve_skills': "You are an Technical Human Resource Manager with expertise in data science, your role is to scrutinize the resume in light of the job description provided. Share your insights on the candidate's suitability for the role from an HR perspective. Additionally, offer advice on enhancing the candidate's skills and identify areas where improvement is needed.",
    'keywords_missing': "You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, your task is to evaluate the resume against the provided job description. As a Human Resource manager, assess the compatibility of the resume with the role. Give me what are the keywords that are missing Also, provide recommendations for enhancing the candidate's skills and identify which areas require further development.",
    'percentage_match': "You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, your task is to evaluate the resume against the provided job description. give me the percentage of match if the resume matches the job description. First the output should come as percentage and then keywords missing and last final thoughts."
}
# Mock-up of a function that you would replace with actual model calls
def get_ai_response(input_prompt, pdf_text_content):
    # This function should integrate with your AI model
    # For demonstration, it returns a string combining input and content
    return "AI Response based on input: {}, content: {}".format(input_prompt, pdf_text_content)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'pdf_content' not in request.files:
            return jsonify({"error": "PDF file is required"}), 400

        pdf_file = request.files['pdf_content']
        prompt_type = request.form.get('prompt_type')
        if not prompt_type:
            return jsonify({"error": "Prompt type not specified"}), 400

        pdf_stream = io.BytesIO(pdf_file.read())
        pdf_content = get_pdf_text_content(pdf_stream)
        prompt = PROMPTS.get(prompt_type, "Default prompt if type not found")
        response_text = get_gemini_response(prompt, pdf_content)
        return jsonify({"response": response_text})

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

def get_pdf_text_content(pdf_stream):
    try:
        document = fitz.open(stream=pdf_stream, filetype="pdf")
        text_parts = [page.get_text() for page in document]
        return " ".join(text_parts)
    except Exception as e:
        app.logger.error(f"Error processing PDF: {str(e)}")
        raise  # Re-raise the exception to handle it in the calling function

def get_gemini_response(input_prompt, pdf_text_content):
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content([input_prompt, pdf_text_content])
        return response.text
    except AttributeError as e:
        app.logger.error(f"Failed to access GenerativeModel: {str(e)}")
        raise
    except Exception as e:
        app.logger.error(f"Error during content generation: {str(e)}")
        raise

if __name__ == '__main__':
    app.run(debug=True, port=5001)
