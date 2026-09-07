recommendations = {

    "Apple___Apple_scab":
        "Remove infected leaves and improve air circulation around the plant.",

    "Apple___Black_rot":
        "Remove infected fruits and branches and keep the orchard clean.",

    "Apple___Cedar_apple_rust":
        "Remove infected leaves and monitor the plant regularly.",

    "Cherry_including_sour___Powdery_mildew":
        "Improve air circulation and remove heavily infected leaves.",

    "Corn_maize___Cercospora_leaf_spot Gray_leaf_spot":
        "Remove infected plant material and improve field ventilation.",

    "Corn_maize___Common_rust_":
        "Monitor the crop and remove severely affected leaves.",

    "Corn_maize___Northern_Leaf_Blight":
        "Remove infected residues and monitor the crop regularly.",

    "Grape___Black_rot":
        "Remove infected berries and leaves and maintain good vineyard sanitation.",

    "Grape___Esca_Black_Measles":
        "Remove severely affected plant parts and monitor the vineyard.",

    "Grape___Leaf_blight_Isariopsis_Leaf_Spot":
        "Remove infected leaves and improve air circulation.",

    "Orange___Haunglongbing_Citrus_greening":
        "Remove severely affected trees and control insect vectors.",

    "Peach___Bacterial_spot":
        "Remove infected leaves and fruit and avoid overhead irrigation.",

    "Pepper _bell___Bacterial_spot":
        "Remove infected plant material and avoid overhead watering.",

    "Potato___Early_blight":
        "Remove infected leaves and maintain proper crop sanitation.",

    "Potato___Late_blight":
        "Remove infected plant material and avoid prolonged leaf moisture.",

    "Squash___Powdery_mildew":
        "Improve air circulation and remove heavily infected leaves.",

    "Strawberry___Leaf_scorch":
        "Remove affected leaves and maintain proper irrigation.",

    "Tomato___Bacterial_spot":
        "Remove infected leaves and avoid overhead irrigation.",

    "Tomato___Early_blight":
        "Remove infected leaves and improve air circulation.",

    "Tomato___Late_blight":
        "Remove infected plant material and avoid prolonged leaf wetness.",

    "Tomato___Leaf_Mold":
        "Improve ventilation and reduce humidity around the plants.",

    "Tomato___Septoria_leaf_spot":
        "Remove infected leaves and avoid overhead watering.",

    "Tomato___Spider_mites-Two-spotted_spider_mite":
        "Inspect the underside of leaves and monitor the infestation closely.",

    "Tomato___Target_Spot":
        "Remove infected leaves and improve air circulation.",

    "Tomato___Tomato_Yellow_Leaf_Curl_Virus":
        "Remove severely infected plants and control whitefly populations.",

    "Tomato___Tomato_mosaic_virus":
        "Remove infected plants and disinfect tools to reduce virus transmission."
}


def get_recommendation(class_name):

    if "healthy" in class_name.lower():

        return (
            "The plant appears healthy. "
            "Continue regular monitoring, "
            "proper irrigation, and balanced fertilization."
        )

    return recommendations.get(
        class_name,
        "Monitor the plant regularly and consult an agricultural specialist if symptoms continue."
    )