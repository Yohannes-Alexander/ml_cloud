const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
 
 
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
 
        // const classResult = tf.argMax(prediction, 1).dataSync()[0];
        let label, suggestion;
        if (confidenceScore <= 50) {
            label = 'Non-cancer';
            suggestion = 'Anda tidak terdeteksi cancer, jagalah kesehatan anda !'

        } else {
            label = 'Cancer'
            suggestion = 'Segera periksa ke dokter !'
        }

        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
 
module.exports = predictClassification;