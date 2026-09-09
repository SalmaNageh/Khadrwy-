# =====================================================
# KHADRWY - RAG KNOWLEDGE BASE
# =====================================================

documents = [

    # =================================================
    # TOMATO EARLY BLIGHT
    # =================================================

    {
        "title": "Tomato Early Blight",
        "content": """
        Tomato early blight is a fungal disease that commonly
        affects tomato plants.

        Common symptoms include dark circular spots on older
        leaves. These spots may have concentric rings, creating
        a target-like appearance.

        Infected leaves may develop yellowing around the spots.
        Severe infection can lead to premature leaf drop.

        The disease can affect plant growth when infection becomes
        severe.

        Good management practices include removing infected leaves,
        improving air circulation around plants, avoiding overhead
        irrigation, and keeping foliage dry.

        Early blight is also known as Alternaria leaf spot and is
        associated with Alternaria fungi.
        """
    },


    # =================================================
    # TOMATO LATE BLIGHT
    # =================================================

    {
        "title": "Tomato Late Blight",
        "content": """
        Tomato late blight is a serious disease that can affect
        tomato leaves, stems, and fruits.

        Symptoms include irregular dark brown or black lesions.
        The disease can develop rapidly and may cause severe
        plant decline.

        High humidity and cool, wet conditions can favor disease
        development.

        Management includes removing severely infected plant
        material, improving air circulation, and avoiding prolonged
        leaf wetness.

        Tomato late blight is associated with Phytophthora
        infestans.
        """
    },


    # =================================================
    # POWDERY MILDEW
    # =================================================

    {
        "title": "Powdery Mildew",
        "content": """
        Powdery mildew is a fungal disease that commonly appears
        as white or gray powder-like growth on leaves and stems.

        The powder-like appearance is one of the characteristic
        visual symptoms of the disease.

        Good air circulation can help reduce disease development.

        Avoiding excessive humidity around foliage can also help.

        Infected plant parts should be monitored and removed when
        appropriate.
        """
    },


    # =================================================
    # PLANT IRRIGATION
    # =================================================

    {
        "title": "Plant Irrigation",
        "content": """
        Plants need appropriate irrigation depending on their
        species, soil, temperature, humidity, and growth stage.

        Overwatering can cause root problems.

        Underwatering can cause wilting and reduced plant growth.

        Soil moisture should be checked before irrigation when
        possible.

        Irrigation should be adjusted according to plant needs
        rather than following the same schedule for every plant.
        """
    },


    # =================================================
    # HEALTHY PLANT CARE
    # =================================================

    {
        "title": "Healthy Plant Care",
        "content": """
        Healthy plants generally need suitable sunlight,
        appropriate watering, good soil drainage, sufficient
        nutrients, and regular monitoring.

        Removing damaged leaves can help maintain plant health.

        Good air circulation can help reduce the risk of disease.

        Regular observation of leaves, stems, and overall plant
        condition can help identify problems early.
        """
    }

]


# =====================================================
# GET DOCUMENTS
# =====================================================

def get_documents():

    return documents