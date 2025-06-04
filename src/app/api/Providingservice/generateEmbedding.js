import axios from 'axios';

async function generateEmbedding({text,serviceId,collection}) {
  try {

    console.log(text, serviceId.toString() , collection )


    //https://ai-agent-by-node.vercel.app/embed
    const response = await axios.post('https://ai-agent-by-bullmq-redis-railway-production.up.railway.app/api/embed', {
      text,
      serviceId: serviceId.toString(),
      collection,
    });

    // console.log('Embedding vector:', response);
    return response.message; // ✅ ده أهم سطر
  } catch (error) {
    console.error('Error generating embedding:', error.response?.data || error.message);
    return []; // ✅ لو حصل خطأ، رجّع مصفوفة فاضية
  }
}

export { generateEmbedding };
