import axios from 'axios';

async function generateEmbedding(text) {
  try {
    const response = await axios.post('https://ai-agent-by-node.vercel.app/embed', {
      text,
    });

    // console.log('Embedding vector:', response.data.embedding);
    return response.data.embedding; // ✅ ده أهم سطر
  } catch (error) {
    console.error('Error generating embedding:', error.response?.data || error.message);
    return []; // ✅ لو حصل خطأ، رجّع مصفوفة فاضية
  }
}

export { generateEmbedding };
