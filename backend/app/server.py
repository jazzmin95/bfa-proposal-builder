import openai
from fastapi import FastAPI, File, UploadFile, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware


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


## Endpoint to upload all the PROPOSALS and RFPs, plus the MAIN_RFP and then call the OpenAI API to get the Section 1 text
@app.post("/upload_RFP")
async def upload_RFP(file: UploadFile = File(...), proposal_type: str = "research"):
    try:
        # Create a dictionary to store file IDs with meaningful names
        uploaded_files = {}
        
        # Upload main RFP
        main_RFP = await file.read()
        main_rfp_upload = openai.File.create(
            file=main_RFP,
            purpose='assistants'
        )
        uploaded_files['main_rfp'] = main_rfp_upload.id
        
        
        # Get and upload all proposal files
        proposals_dir = f'static/{proposal_type}/proposals'
        for filename in os.listdir(proposals_dir):
            with open(os.path.join(proposals_dir, filename), 'rb') as f:
                proposal_upload = openai.File.create(
                    file=f.read(),
                    purpose='assistants'
                )
                uploaded_files[f'proposal_{filename}'] = proposal_upload.id
                
        # Get and upload all RFP files
        rfps_dir = f'static/{proposal_type}/rfps'
        for filename in os.listdir(rfps_dir):
            with open(os.path.join(rfps_dir, filename), 'rb') as f:
                rfp_upload = openai.File.create(
                    file=f.read(),
                    purpose='assistants'
                )
                uploaded_files[f'rfp_{filename}'] = rfp_upload.id

        # Create the prompt
        prompt = f"""You are a sales expert who wants to summarize the requirements stated in an RFP (Request for proposals) for research projects. This RFP is made public by a potential client of BFA who wants to outsource the research project to the best possible candidate.

The output summary, called "Our understanding of your requirements", will be the first section of the full proposal to convince the client that BFA is the best choice available.

I have uploaded four RFPs and the four full proposals that BFA sent to the client:

RFP files:
{chr(10).join([f'- {key}: {value}' for key, value in uploaded_files.items() if key.startswith('rfp_')])}

Proposal files:
{chr(10).join([f'- {key}: {value}' for key, value in uploaded_files.items() if key.startswith('proposal_')])}

Your task is to create the summary for the main RFP (file ID: {uploaded_files['main_rfp']}).

Formatting instructions:
Use the same tone, style, and wording as the examples uploaded
Create a summary that is similar in structure and length to the examples provided below
Identify how the summary was created from the past RFP-Proposal example pairs and follow the same patterns for the tasked summary

Process instructions:
Firstly, read all 4 RFPs and their matching Proposals to understand how BFA is crafting this summary. 
Only then, read the main RFP and craft your own summary for it."""
        
        # Call OpenAI API with all file attachments
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt}
            ],
            file_ids=[uploaded_files[file_id] for file_id in uploaded_files],
            temperature=0.0
        )
        
        # Extract and return the response
        analysis_result = response.choices[0].message.content
        
        return {"status": "success", "result": analysis_result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
