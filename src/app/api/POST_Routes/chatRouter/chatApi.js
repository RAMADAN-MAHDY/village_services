import axios from 'axios';

async function chatApi(text) {
  try {
    const response = await axios.post('https://ai-agent-by-node.vercel.app/ask', {
      text,
    });

    // console.log('answer', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error generating embedding:', error.response?.data || error.message);
    return []; // ✅ لو حصل خطأ، رجّع مصفوفة فاضية
  }
}

export { chatApi };