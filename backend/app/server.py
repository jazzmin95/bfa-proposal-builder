import openai
from fastapi import FastAPI, File, UploadFile, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path

# Get the root directory and load .env
root_dir = Path(__file__).parent.parent.parent
load_dotenv(root_dir / '.env')

print(f"Looking for .env in: {root_dir}")
print(f"API Key found: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")



# Get OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise HTTPException(status_code=500, detail="OpenAI API key not found in environment variables")


app = FastAPI()

# Define the origins that are allowed to access the backend
origins = [
    "http://localhost:3000",  # Replace with your frontend's URL
]

# Add CORS middleware to allow requests from specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


## Endpoint to upload all the PROPOSALS and RFPs, plus the MAIN_RFP and then call the Gemini API to get the Section 1 text
@app.post("/upload_RFP")
async def upload_RFP(file: UploadFile = File(...), proposal_type: str = "research"):
    try:
        import google.generativeai as genai
        
        # Configure Gemini API
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')
        
        # Read the main RFP file
        main_RFP = await file.read()
        
        # Read example proposals and RFPs
        example_files = {
            'proposals': [],
            'rfps': []
        }
        
        # Get all proposal files
        proposals_dir = f'static/{proposal_type}/proposals'
        for filename in os.listdir(proposals_dir):
            with open(os.path.join(proposals_dir, filename), 'rb') as f:
                example_files['proposals'].append(f.read())
                
        # Get all RFP files
        rfps_dir = f'static/{proposal_type}/rfps'
        for filename in os.listdir(rfps_dir):
            with open(os.path.join(rfps_dir, filename), 'rb') as f:
                example_files['rfps'].append(f.read())

        # Create the prompt
        prompt = """You are a sales expert who wants to summarize the requirements stated in an RFP (Request for proposals) for a research project. This RFP is made public by a potential client of BFA who wants to outsource the research project to the best possible candidate.

The output summary, called "Our understanding of your requirements", will be the first section of the full proposal to convince the client that BFA is the best choice available.

I have uploaded four example RFPs and their corresponding full proposals that BFA sent to previous clients. The proposal "Proposal_1.pdf" corresponds to the RFP "RFP_1.pdf", and so on.

Your task is to create a summary for the "MainRFP.pdf" file.

Formatting instructions:
Use the same tone, style, and wording as the examples provided
Create a summary that is similar in structure and length to the examples
Identify how the summary was created from the past RFP-Proposal example pairs and follow the same patterns for the tasked summary

Process instructions:
Firstly, read all 4 RFPs and their matching Proposals to understand how BFA is crafting this summary. 
Only then, read the main RFP and craft your own summary for it."""

        # Call Gemini API with context and main RFP
        response = model.generate_content([
            prompt,
            "Example RFPs:",
            *example_files['rfps'],
            "Example Proposals:",
            *example_files['proposals'],
            "Main RFP to summarize:",
            main_RFP
        ])
        
        # Extract and return the response
        analysis_result = response.text
        
        return {"status": "success", "result": analysis_result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
