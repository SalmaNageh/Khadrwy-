# =====================================================
# KHADRWY - RAG KNOWLEDGE BASE
# =====================================================

documents = [

    # =================================================
    # TOMATO - EARLY BLIGHT
    # =================================================

    {
        "title": "Tomato Early Blight",
        "plant": "Tomato",
        "condition": "Early Blight",
        "category": "disease",

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
    # TOMATO - LATE BLIGHT
    # =================================================

    {
        "title": "Tomato Late Blight",
        "plant": "Tomato",
        "condition": "Late Blight",
        "category": "disease",

        "content": """
        Tomato late blight is a serious disease that can affect
        tomato leaves, stems, and fruits.

        Symptoms include irregular dark brown or black lesions.

        The disease can develop rapidly and may cause severe
        plant decline.

        High humidity and cool, wet conditions can favor disease
        development.

        Management includes removing severely infected plant
        material, improving air circulation, and avoiding
        prolonged leaf wetness.

        Tomato late blight is associated with Phytophthora
        infestans.
        """
    },


    # =================================================
    # POWDERY MILDEW
    # =================================================

    {
        "title": "Powdery Mildew",
        "plant": "General",
        "condition": "Powdery Mildew",
        "category": "disease",

        "content": """
        Powdery mildew is a fungal disease that commonly appears
        as white or gray powder-like growth on leaves and stems.

        The powder-like appearance is one of the characteristic
        visual symptoms of the disease.

        Good air circulation can help reduce disease development.

        Avoiding excessive humidity around foliage can also help.

        Infected plant parts should be monitored and removed
        when appropriate.
        """
    },


    # =================================================
    # APPLE - APPLE SCAB
    # =================================================

    {
        "title": "Apple Scab",
        "plant": "Apple",
        "condition": "Apple Scab",
        "category": "disease",

        "content": """
        Apple scab is a fungal disease that affects apple leaves
        and fruits.

        Symptoms can include olive-green to dark lesions on
        leaves and fruit surfaces.

        Severe infection can cause leaf damage and premature
        leaf drop.

        Infected fruit may develop rough or damaged areas.

        Good orchard sanitation and removal of infected plant
        material can help reduce disease pressure.

        Good air circulation and avoiding prolonged leaf wetness
        can also help reduce favorable conditions for disease
        development.
        """
    },


    # =================================================
    # APPLE - BLACK ROT
    # =================================================

    {
        "title": "Apple Black Rot",
        "plant": "Apple",
        "condition": "Black Rot",
        "category": "disease",

        "content": """
        Apple black rot is a fungal disease that can affect
        leaves, fruit, and branches.

        Leaf symptoms may include circular brown or purple
        spots that can develop over time.

        Fruit infections can lead to dark rotting areas.

        Removing infected fruit and plant material can help
        reduce sources of infection.

        Good orchard sanitation and proper air circulation are
        important components of disease management.
        """
    },


    # =================================================
    # APPLE - CEDAR APPLE RUST
    # =================================================

    {
        "title": "Apple Cedar Apple Rust",
        "plant": "Apple",
        "condition": "Cedar Apple Rust",
        "category": "disease",

        "content": """
        Cedar apple rust is a fungal disease that affects apple
        leaves and fruit.

        Symptoms on apple leaves may include yellow to orange
        spots.

        Infected leaves can develop more visible structures as
        the disease progresses.

        Disease development is associated with the presence of
        suitable hosts and environmental conditions.

        Monitoring affected leaves and maintaining good plant
        health can help manage disease pressure.
        """
    },


    # =================================================
    # CORN - COMMON RUST
    # =================================================

    {
        "title": "Corn Common Rust",
        "plant": "Corn",
        "condition": "Common Rust",
        "category": "disease",

        "content": """
        Corn common rust is a fungal disease that affects corn
        leaves.

        Symptoms commonly appear as reddish-brown to rust-colored
        pustules on leaf surfaces.

        Severe infection can reduce healthy leaf area and may
        affect plant growth.

        Regular monitoring of leaves can help identify symptoms
        early.

        Maintaining good crop management and monitoring disease
        development are important for reducing potential damage.
        """
    },


    # =================================================
    # CORN - NORTHERN LEAF BLIGHT
    # =================================================

    {
        "title": "Corn Northern Leaf Blight",
        "plant": "Corn",
        "condition": "Northern Leaf Blight",
        "category": "disease",

        "content": """
        Northern leaf blight is a fungal disease affecting corn.

        Symptoms commonly include long gray-green to tan lesions
        on leaves.

        Lesions can expand and reduce the healthy photosynthetic
        area of the plant.

        Monitoring crop leaves and maintaining appropriate field
        management can help identify and manage the disease.
        """
    },


    # =================================================
    # CORN - GRAY LEAF SPOT
    # =================================================

    {
        "title": "Corn Gray Leaf Spot",
        "plant": "Corn",
        "condition": "Gray Leaf Spot",
        "category": "disease",

        "content": """
        Gray leaf spot is a fungal disease affecting corn leaves.

        Symptoms commonly appear as rectangular gray or tan
        lesions that develop between leaf veins.

        Severe disease can reduce the functional leaf area of
        the plant.

        Monitoring leaves regularly can help identify symptoms
        before the disease becomes severe.

        Good crop management and monitoring of environmental
        conditions can help reduce disease development.
        """
    },


    # =================================================
    # HEALTHY PLANT CARE
    # =================================================

    {
        "title": "Healthy Plant Care",
        "plant": "General",
        "condition": "Healthy",
        "category": "plant_care",

        "content": """
        Healthy plants generally need suitable sunlight,
        appropriate watering, good soil drainage, sufficient
        nutrients, and regular monitoring.

        Removing damaged or diseased leaves can help maintain
        plant health.

        Good air circulation can help reduce the risk of some
        plant diseases.

        Regular observation of leaves, stems, roots, and overall
        plant condition can help identify problems early.

        Plant care should be adjusted according to plant species,
        growth stage, soil conditions, and environmental factors.
        """
    },


    # =================================================
    # PLANT IRRIGATION
    # =================================================

    {
        "title": "Plant Irrigation",
        "plant": "General",
        "condition": "Irrigation",
        "category": "irrigation",

        "content": """
        Plants need appropriate irrigation depending on their
        species, soil, temperature, humidity, and growth stage.

        Overwatering can contribute to root problems and poor
        plant health.

        Underwatering can cause wilting and reduced plant growth.

        Soil moisture should be checked before irrigation when
        possible.

        Irrigation should be adjusted according to plant needs
        rather than following the same schedule for every plant.

        Environmental conditions should also be considered when
        deciding when plants need water.
        """
    },


    # =================================================
    # SOIL MOISTURE
    # =================================================

    {
        "title": "Soil Moisture Management",
        "plant": "General",
        "condition": "Soil Moisture",
        "category": "soil",

        "content": """
        Soil moisture is an important factor in plant health.

        Plants need an appropriate level of water in the root
        zone.

        Excessively wet soil can reduce root oxygen availability
        and may contribute to root problems.

        Very dry soil can cause water stress and plant wilting.

        Soil moisture should be monitored when possible instead
        of relying only on a fixed irrigation schedule.

        Irrigation decisions should consider the plant species,
        soil characteristics, environmental conditions, and
        growth stage.
        """
    },


    # =================================================
    # TEMPERATURE
    # =================================================

    {
        "title": "Plant Temperature Management",
        "plant": "General",
        "condition": "Temperature",
        "category": "environment",

        "content": """
        Temperature affects plant growth, water use, and overall
        plant development.

        Extremely high or low temperatures can cause plant stress.

        Temperature should be considered together with humidity,
        soil moisture, light, plant species, and growth stage.

        Monitoring temperature can help identify environmental
        conditions that may contribute to plant stress.
        """
    },


    # =================================================
    # HUMIDITY
    # =================================================

    {
        "title": "Plant Humidity Management",
        "plant": "General",
        "condition": "Humidity",
        "category": "environment",

        "content": """
        Humidity affects plant water loss and the development of
        some plant diseases.

        High humidity combined with prolonged leaf wetness can
        create favorable conditions for some fungal and
        disease-related problems.

        Good air circulation can help reduce prolonged moisture
        around plant foliage.

        Humidity should be considered together with temperature,
        irrigation, ventilation, and plant type.
        """
    },


    # =================================================
    # LIGHT
    # =================================================

    {
        "title": "Plant Light Requirements",
        "plant": "General",
        "condition": "Light",
        "category": "environment",

        "content": """
        Light is important for photosynthesis and healthy plant
        growth.

        Different plant species have different light
        requirements.

        Insufficient light can affect plant growth and
        development.

        Excessive light or high heat can contribute to plant
        stress in some conditions.

        Light should be considered together with temperature,
        water availability, plant species, and growth stage.
        """
    },


    # =================================================
    # AIR CIRCULATION
    # =================================================

    {
        "title": "Plant Air Circulation",
        "plant": "General",
        "condition": "Air Circulation",
        "category": "plant_care",

        "content": """
        Good air circulation around plants can help reduce
        prolonged moisture on leaves.

        Improved air movement can be particularly useful in
        greenhouse and dense planting environments.

        Poor air circulation combined with high humidity can
        create conditions favorable for some plant diseases.

        Ventilation should be considered as part of general
        plant and greenhouse management.
        """
    },


    # =================================================
    # OVERWATERING
    # =================================================

    {
        "title": "Plant Overwatering",
        "plant": "General",
        "condition": "Overwatering",
        "category": "irrigation",

        "content": """
        Overwatering occurs when plants receive more water than
        their growing conditions require.

        Excess water can keep soil overly wet and may contribute
        to root problems.

        Possible signs can include poor growth, yellowing leaves,
        and persistently wet soil, although symptoms can have
        multiple causes.

        Soil moisture should be checked before additional
        irrigation when possible.

        Watering should be adjusted according to plant needs,
        soil conditions, temperature, humidity, and growth stage.
        """
    },


    # =================================================
    # UNDERWATERING
    # =================================================

    {
        "title": "Plant Underwatering",
        "plant": "General",
        "condition": "Underwatering",
        "category": "irrigation",

        "content": """
        Underwatering occurs when a plant does not receive enough
        water for its current needs.

        Possible signs include wilting, dry soil, and reduced
        growth.

        Symptoms can vary depending on the plant species and
        environmental conditions.

        Soil moisture should be checked when possible before
        deciding whether additional irrigation is required.
        """
    },


    # =================================================
    # PLANT NUTRITION
    # =================================================

    {
        "title": "Plant Nutrition",
        "plant": "General",
        "condition": "Nutrition",
        "category": "nutrition",

        "content": """
        Plants require nutrients for normal growth and
        development.

        Nutrient requirements vary according to plant species,
        growth stage, soil conditions, and production system.

        Poor growth or leaf discoloration can have multiple
        possible causes, including nutrient problems,
        environmental stress, pests, or diseases.

        Nutrient management should therefore consider the
        complete plant and growing environment rather than
        relying on a single symptom.
        """
    },


    # =================================================
    # DISEASE PREVENTION
    # =================================================

    {
        "title": "Plant Disease Prevention",
        "plant": "General",
        "condition": "Disease Prevention",
        "category": "prevention",

        "content": """
        Regular monitoring of leaves, stems, fruits, and overall
        plant condition can help identify plant diseases early.

        Removing severely affected plant material when
        appropriate can help reduce potential sources of disease.

        Good air circulation can reduce prolonged moisture around
        foliage.

        Avoiding unnecessary prolonged leaf wetness can help
        reduce conditions favorable to some diseases.

        Good sanitation and appropriate irrigation are important
        components of general disease prevention.
        """
    },


    # =================================================
    # GREENHOUSE MANAGEMENT
    # =================================================

    {
        "title": "Greenhouse Plant Management",
        "plant": "General",
        "condition": "Greenhouse Management",
        "category": "greenhouse",

        "content": """
        Greenhouse plant management requires monitoring
        environmental conditions such as temperature, humidity,
        soil moisture, and light.

        Ventilation and air circulation are important for
        managing humidity and reducing prolonged leaf wetness.

        Irrigation should be adjusted according to plant needs
        and monitored soil moisture.

        Regular monitoring can help identify environmental
        changes before they cause significant plant stress.
        """
    },


    # =================================================
    # PLANT MONITORING
    # =================================================

    {
        "title": "Smart Plant Monitoring",
        "plant": "General",
        "condition": "Plant Monitoring",
        "category": "monitoring",

        "content": """
        Monitoring plant environments can include measuring
        temperature, humidity, soil moisture, and light.

        Soil moisture measurements can help support irrigation
        decisions.

        Temperature and humidity measurements can help identify
        environmental conditions that may contribute to plant
        stress or disease development.

        Light measurements can provide information about the
        plant growing environment.

        Combining multiple environmental measurements provides
        more useful information than relying on a single sensor.
        """
    }

]


# =====================================================
# GET DOCUMENTS
# =====================================================

def get_documents():
    """
    Return all agricultural knowledge documents.
    """

    return documents