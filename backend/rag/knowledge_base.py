# =====================================================
# KHADRWY - AGRICULTURAL KNOWLEDGE BASE
# =====================================================
#
# Curated agricultural knowledge for Khadrwy AI.
#
# IMPORTANT:
# - This is a manually curated knowledge base.
# - It is NOT an OCR extraction of the FAO PDFs.
# - No unsupported pesticide names, chemical doses,
#   fertilizer rates, or treatment schedules are included.
# - The RAG generator should only answer from supported
#   information.
#
# Main knowledge areas:
# - Plant health
# - Cultivation
# - Greenhouse management
# - Monitoring
# - Sensors
# - Early stress detection
# - Irrigation
# - Soil
# - Nutrition
# - Diseases
# - Pests
# - Seeds and seedlings
# - Harvest and post-harvest
# - Crop-specific guidance
# =====================================================


# =====================================================
# KNOWLEDGE DOCUMENTS
# =====================================================

documents = [

    # =================================================
    # 1. GENERAL PLANT HEALTH
    # =================================================

    {
        "title": "Healthy Plant Care",
        "plant": "General",
        "condition": "Healthy",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Healthy plant growth depends on balanced environmental and
management conditions. Important factors include suitable
light, appropriate temperature, adequate water, suitable
soil or growing medium, sufficient nutrition, good air
circulation, and regular monitoring.

Plants should be observed regularly for changes in leaf
color, leaf shape, growth rate, wilting, spots, pest activity,
and changes in soil moisture.

Early observation helps identify problems before they become
severe.
"""
    },

    {
        "title": "General Plant Stress Assessment",
        "plant": "General",
        "condition": "Plant Stress",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant stress can result from unsuitable water availability,
temperature conditions, humidity, light, soil conditions,
nutrition, pests, diseases, or physical damage.

Stress assessment should consider the whole growing
environment rather than relying on one symptom.

Useful observations include leaf color, wilting, growth rate,
new growth, root condition when visible, soil moisture,
temperature, humidity, light, and recent management changes.
"""
    },

    {
        "title": "Plant Problem Diagnosis Principles",
        "plant": "General",
        "condition": "Plant Problem",
        "category": "diagnosis",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant diagnosis should consider symptoms together with
environmental and management information.

Important observations include where symptoms appear, whether
they affect old or new leaves, whether symptoms are spreading,
soil moisture, recent irrigation, temperature, humidity,
light, nutrition, pest presence, and cultivation practices.

A single symptom does not always identify one specific cause.
Different problems can produce similar visible symptoms.
"""
    },

    {
        "title": "Integrated Plant Health Management",
        "plant": "General",
        "condition": "Plant Health",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Integrated plant health management combines environmental
management, irrigation management, soil care, nutrition,
sanitation, pest monitoring, disease observation, and regular
record keeping.

The goal is to maintain suitable growing conditions and
detect problems early rather than relying only on treatment
after severe symptoms appear.
"""
    },


    # =================================================
    # 2. MONITORING
    # =================================================

    {
        "title": "General Plant Monitoring",
        "plant": "General",
        "condition": "Monitoring",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant monitoring means regularly observing and recording
environmental conditions and plant condition over time.

Useful monitoring information can include temperature,
relative humidity, soil or growing-medium moisture, light,
irrigation events, plant growth, leaf condition, pest activity,
and disease symptoms.

Monitoring is more useful when observations are recorded
consistently so that changes and trends can be identified.
"""
    },

    {
        "title": "Plant Growth Monitoring",
        "plant": "General",
        "condition": "Growth",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant growth monitoring involves observing changes in plant
size, new leaves, branching, flowering, fruit development,
overall vigor, and visible stress.

Repeated observations are more useful than a single
observation because they allow changes in growth patterns to
be noticed.

Unexpected slowing of growth, abnormal new growth, repeated
wilting, or progressive leaf changes should trigger closer
inspection of environmental and management conditions.
"""
    },

    {
        "title": "Plant Symptom Monitoring",
        "plant": "General",
        "condition": "Symptoms",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant symptom monitoring includes regular observation of
yellowing, browning, spots, wilting, curling, unusual growth,
leaf damage, and changes in plant vigor.

The location and progression of symptoms should be recorded.
It is useful to note whether symptoms affect older leaves,
new leaves, isolated plants, or many plants.

Changes over time can provide useful evidence when assessing
plant health.
"""
    },

    {
        "title": "Environmental Trend Monitoring",
        "plant": "General",
        "condition": "Environmental Stress",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Environmental monitoring should focus not only on individual
measurements but also on changes over time.

Repeated measurements of temperature, humidity, soil moisture,
and light can help identify changing environmental conditions.

A sudden or persistent change should be considered together
with plant observations and recent management activities.

Environmental data alone does not automatically establish
the cause of a plant disease.
"""
    },

    {
        "title": "Early Plant Stress Detection",
        "plant": "General",
        "condition": "Early Stress",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Early plant stress detection depends on noticing changes
before severe damage develops.

Useful warning signs include changes in leaf color, repeated
wilting, reduced growth, unusual new growth, changes in soil
moisture, persistent environmental changes, increasing pest
activity, and the appearance or spread of leaf symptoms.

Early warning should be based on multiple observations rather
than one measurement or one symptom.
"""
    },

    {
        "title": "Early Warning for Plant Problems",
        "plant": "General",
        "condition": "Early Warning",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
An early warning approach compares current plant and
environmental observations with previous observations.

Useful warning signals include persistent changes in soil
moisture, unusual temperature or humidity patterns, declining
plant growth, increasing pest observations, or progressive
leaf symptoms.

The purpose of early warning is to trigger closer inspection
and investigation. It does not by itself confirm a disease or
specific cause.
"""
    },

    {
        "title": "Greenhouse Monitoring Workflow",
        "plant": "General",
        "condition": "Greenhouse Monitoring",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
A practical greenhouse monitoring workflow can include:

1. Record temperature and relative humidity.
2. Monitor soil or growing-medium moisture.
3. Observe light conditions.
4. Record irrigation and important management events.
5. Observe plant growth and leaf condition.
6. Check for pests and disease symptoms.
7. Compare observations with previous records.
8. Investigate unusual changes.
9. Continue monitoring after management changes.

Monitoring should support decision making rather than replace
plant inspection.
"""
    },

    {
        "title": "Monitoring vs Diagnosis",
        "plant": "General",
        "condition": "Monitoring and Diagnosis",
        "category": "diagnosis",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Monitoring is the repeated observation and recording of plant
and environmental conditions.

Diagnosis is the process of determining the most likely cause
of a plant problem using symptoms, environmental conditions,
management history, and other available evidence.

Monitoring can provide evidence for diagnosis, but monitoring
alone does not necessarily confirm a disease or specific cause.
"""
    },

    {
        "title": "Agricultural Record Keeping",
        "plant": "General",
        "condition": "Record Keeping",
        "category": "monitoring",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Agricultural records help identify patterns and changes over
time.

Useful records can include environmental measurements,
irrigation events, nutrition activities, planting information,
growth observations, pest observations, disease symptoms, and
management actions.

Consistent records make it easier to compare conditions before
and after a problem appears or a management action is taken.
"""
    },


    # =================================================
    # 3. SENSOR-BASED MONITORING
    # =================================================

    {
        "title": "Sensor-Based Plant Monitoring",
        "plant": "General",
        "condition": "Sensor Monitoring",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Sensors can support continuous monitoring of environmental
conditions around plants.

Common monitoring variables include temperature, relative
humidity, soil or substrate moisture, and light intensity.

Sensor readings should be interpreted together with plant
observations and management records. A sensor measurement
alone does not prove that a plant has a disease.
"""
    },

    {
        "title": "Temperature and Humidity Monitoring",
        "plant": "General",
        "condition": "Temperature and Humidity",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Temperature and relative humidity are important environmental
variables for greenhouse plant management.

Continuous or repeated measurements can help identify changes
in the growing environment.

Temperature and humidity should be considered together with
ventilation, crop requirements, irrigation, plant density,
and observed plant condition.

Measurements should be recorded over time so persistent or
unusual changes can be recognized.
"""
    },

    {
        "title": "Soil Moisture Monitoring",
        "plant": "General",
        "condition": "Soil Moisture",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil or growing-medium moisture monitoring provides information
about the water condition around plant roots.

Repeated soil moisture observations can help identify patterns
such as persistently wet conditions or rapid drying.

Soil moisture should be interpreted together with plant
condition, soil drainage, temperature, humidity, crop needs,
and recent irrigation.

A moisture reading by itself does not determine whether a plant
has a disease.
"""
    },

    {
        "title": "Light Monitoring for Plants",
        "plant": "General",
        "condition": "Light",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Light is an important environmental factor for plant growth.

Light monitoring can help identify changes in the growing
environment and should be considered together with plant growth,
leaf development, and the crop's environmental requirements.

Sudden changes in light conditions should be recorded and
compared with plant responses.
"""
    },

    {
        "title": "Sensor Data Interpretation",
        "plant": "General",
        "condition": "Sensor Data",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Sensor data should be interpreted as measurements of the
environment rather than direct diagnoses of plant health.

Useful interpretation considers:

- current reading
- previous readings
- duration of the change
- relationship between variables
- plant observations
- irrigation and management history

For example, soil moisture information becomes more useful
when considered together with irrigation history and plant
condition.

Sensor data should support investigation and decision making,
not replace diagnosis.
"""
    },

    {
        "title": "Sensor Trend Analysis",
        "plant": "General",
        "condition": "Sensor Trends",
        "category": "sensors",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Sensor trend analysis involves comparing repeated readings over
time instead of relying on one measurement.

Important observations include persistent increases, decreases,
repeated fluctuations, and unusual changes.

Trend information can be compared with irrigation events,
ventilation changes, weather conditions, and plant symptoms.

A trend can indicate that closer inspection is needed, but it
does not automatically identify the biological cause.
"""
    },


    # =================================================
    # 4. GREENHOUSE
    # =================================================

    {
        "title": "Greenhouse Plant Management",
        "plant": "General",
        "condition": "Greenhouse Management",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Greenhouse management requires coordinated attention to
temperature, humidity, ventilation, light, irrigation,
nutrition, plant density, sanitation, and crop requirements.

The goal is to maintain a suitable growing environment and
reduce conditions that favor plant stress, pests, and diseases.

Management decisions should consider the crop and current
environment rather than using one fixed practice for every
plant.
"""
    },

    {
        "title": "Greenhouse Environmental Monitoring",
        "plant": "General",
        "condition": "Greenhouse Environment",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Greenhouse environmental monitoring should include relevant
conditions such as temperature, relative humidity, ventilation,
light, irrigation, and plant condition.

Monitoring several factors together is important because plant
responses can be influenced by interactions between environmental
conditions.

Regular monitoring can help identify changes that require
closer investigation.
"""
    },

    {
        "title": "Greenhouse Ventilation",
        "plant": "General",
        "condition": "Ventilation",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Proper greenhouse ventilation supports environmental management
and air movement around plants.

Ventilation should be coordinated with temperature, outside
weather conditions, crop requirements, greenhouse design, and
humidity management.

Poor air movement can contribute to an unsuitable growing
environment and may increase conditions favorable to some
plant health problems.
"""
    },

    {
        "title": "Greenhouse Plant Density",
        "plant": "General",
        "condition": "Plant Density",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant density affects air movement, light distribution, and
the accessibility of plants for monitoring.

Very dense plant growth can make inspection more difficult and
can reduce air circulation around plant parts.

Plant density should be considered as part of greenhouse
management together with crop requirements and available space.
"""
    },

    {
        "title": "Protected Cultivation Principles",
        "plant": "General",
        "condition": "Protected Cultivation",
        "category": "greenhouse",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Protected cultivation allows environmental conditions to be
managed more closely than in open-field production.

Important management areas include environmental monitoring,
ventilation, irrigation, crop nutrition, sanitation, plant
density, pest monitoring, and disease observation.

Successful protected cultivation depends on maintaining
appropriate conditions for the crop and responding to changes
in the growing environment.
"""
    },


    # =================================================
    # 5. IRRIGATION AND WATER
    # =================================================

    {
        "title": "Plant Irrigation",
        "plant": "General",
        "condition": "Water Management",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Irrigation should provide plants with appropriate water while
avoiding prolonged excessive moisture.

Water management should consider crop requirements, soil or
growing-medium properties, drainage, environmental conditions,
plant growth stage, and recent moisture observations.

Irrigation decisions should not be based only on a fixed
calendar schedule.
"""
    },

    {
        "title": "Soil Moisture Management",
        "plant": "General",
        "condition": "Soil Moisture",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good soil moisture management aims to avoid both prolonged
excess moisture and inadequate water availability.

Soil moisture should be considered together with drainage,
temperature, humidity, plant size, crop requirements, and
recent irrigation.

Repeated observations can help identify whether soil is
remaining wet for too long or drying faster than expected.
"""
    },

    {
        "title": "Plant Overwatering",
        "plant": "General",
        "condition": "Overwatering",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Excessive or overly frequent irrigation can keep the root
environment wet for prolonged periods.

Overwatering should be considered when plants show poor growth
or other stress symptoms while the growing medium remains
persistently wet.

Assessment should also consider drainage, soil structure,
temperature, humidity, and root condition when available.
"""
    },

    {
        "title": "Plant Underwatering",
        "plant": "General",
        "condition": "Underwatering",
        "category": "irrigation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Insufficient water availability can lead to water stress and
wilting.

Assessment should consider soil moisture, recent irrigation,
temperature, humidity, plant size, and growing conditions.

Wilting alone does not prove that underwatering is the cause,
because other stresses can produce similar symptoms.
"""
    },

    {
        "title": "Soil Drainage",
        "plant": "General",
        "condition": "Drainage",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good drainage helps prevent prolonged water accumulation around
plant roots.

Poor drainage can keep the root environment excessively wet and
can contribute to poor plant performance.

Drainage should be evaluated together with soil structure,
irrigation practices, container design, and soil moisture
observations.
"""
    },


    # =================================================
    # 6. SOIL
    # =================================================

    {
        "title": "Soil for Plant Growth",
        "plant": "General",
        "condition": "Soil",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
A suitable growing soil should provide support, water
availability, air around the roots, and access to nutrients.

Important soil properties include structure, drainage,
water-holding behavior, organic matter, compaction, and pH.

Soil conditions should be considered when diagnosing poor
growth or irregular plant development.
"""
    },

    {
        "title": "Soil Preparation",
        "plant": "General",
        "condition": "Soil Preparation",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil preparation should aim to create a suitable root
environment with good structure and drainage.

Preparation can include removing unsuitable material,
improving soil structure, addressing compaction, and ensuring
appropriate drainage.

The final growing medium should support healthy root
development and water management.
"""
    },

    {
        "title": "Soil pH",
        "plant": "General",
        "condition": "Soil pH",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil pH influences nutrient availability and plant growth.

Unexpected nutrient-related symptoms should be considered
together with soil pH, soil condition, irrigation, and plant
requirements.

Specific ideal pH values should be based on the requirements
of the crop rather than assuming one value is appropriate for
all plants.
"""
    },

    {
        "title": "Soil Compaction",
        "plant": "General",
        "condition": "Soil Compaction",
        "category": "soil",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Soil compaction can reduce pore space and affect water movement
and root development.

Compacted soil may influence drainage and root access to water
and air.

Poor growth associated with compaction should be evaluated
together with irrigation and soil moisture conditions.
"""
    },


    # =================================================
    # 7. PLANT NUTRITION
    # =================================================

    {
        "title": "Plant Nutrition",
        "plant": "General",
        "condition": "Nutrition",
        "category": "nutrition",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plants require appropriate nutrients for growth and development.

Nutrition should be managed according to crop requirements,
soil or growing-medium conditions, plant growth stage, and
available evidence of deficiency or excess.

Nutrient problems should not be diagnosed from one symptom
alone because environmental stress and disease can produce
similar visible changes.
"""
    },

    {
        "title": "General Fertilization Principles",
        "plant": "General",
        "condition": "Fertilization",
        "category": "nutrition",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Fertilization should be based on crop needs and available
information about soil or growing-medium conditions.

Excessive or inappropriate fertilization can create additional
plant stress.

Specific fertilizer rates should be based on reliable crop-
specific recommendations rather than generalized assumptions.
"""
    },

    {
        "title": "Nutrient Deficiency Assessment",
        "plant": "General",
        "condition": "Nutrient Deficiency",
        "category": "nutrition",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Nutrient deficiency assessment should consider the location of
symptoms on the plant, leaf age, growth pattern, soil condition,
pH, irrigation, and other environmental stresses.

Leaf yellowing or poor growth does not automatically prove a
nutrient deficiency.

Additional evidence may be needed before choosing a corrective
action.
"""
    },


    # =================================================
    # 8. DISEASES
    # =================================================

    {
        "title": "General Leaf Spot",
        "plant": "General",
        "condition": "Leaf Spot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Leaf spots are visible changes that can have different causes,
including diseases and environmental or physiological problems.

Assessment should consider spot appearance, location,
progression, affected plant parts, humidity, irrigation,
air circulation, and other symptoms.

Leaf spots should not automatically be attributed to one
specific disease without sufficient evidence.
"""
    },

    {
        "title": "Plant Disease Prevention",
        "plant": "General",
        "condition": "Disease Prevention",
        "category": "disease_prevention",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant disease prevention includes regular monitoring,
sanitation, appropriate irrigation, good air circulation,
suitable plant spacing, healthy planting material, and
management of environmental conditions.

Early detection can help prevent problems from spreading.
"""
    },

    {
        "title": "Agricultural Sanitation",
        "plant": "General",
        "condition": "Sanitation",
        "category": "disease_prevention",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good agricultural sanitation can reduce sources of plant
health problems.

Useful practices include removing severely affected plant
material when appropriate, keeping growing areas clean,
monitoring new planting material, and avoiding unnecessary
spread of contaminated material.

Sanitation should be part of a broader plant health management
program.
"""
    },

    {
        "title": "General Root Rot",
        "plant": "General",
        "condition": "Root Rot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Root problems can be associated with prolonged excessive
moisture and unsuitable root-zone conditions.

Symptoms may include poor growth and wilting despite adequate
or excessive water availability.

Assessment should consider drainage, irrigation, soil moisture,
and root condition when roots can be inspected.
"""
    },

    {
        "title": "General Plant Wilting",
        "plant": "General",
        "condition": "Wilting",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Wilting indicates plant water stress or another plant health
problem but does not identify a single cause.

Possible factors to investigate include soil moisture,
irrigation, root condition, temperature, humidity, pests,
disease, and plant stress.

The surrounding environmental conditions should be reviewed
before deciding on a cause.
"""
    },

    {
        "title": "Plant Leaf Yellowing",
        "plant": "General",
        "condition": "Yellow Leaves",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Leaf yellowing can have multiple causes, including nutrition,
water management, root problems, environmental stress, or
disease.

Assessment should consider which leaves are affected, whether
yellowing is spreading, soil moisture, drainage, nutrition,
light, temperature, and other symptoms.

Yellowing alone should not be treated as proof of one specific
problem.
"""
    },


    # =================================================
    # 9. PEST MONITORING
    # =================================================

    {
        "title": "Plant Pest Monitoring",
        "plant": "General",
        "condition": "Pests",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Pest monitoring involves regular inspection of leaves, stems,
new growth, and other plant parts.

Useful observations include the presence of insects, feeding
damage, sticky residues, discoloration, and changes in plant
growth.

Monitoring helps detect pest populations early and supports
timely investigation.
"""
    },

    {
        "title": "Aphid Monitoring",
        "plant": "General",
        "condition": "Aphids",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Aphids are small sap-feeding insects that may occur on tender
plant growth.

Monitoring should focus on young leaves and shoots and should
include checking for visible insects and associated plant
damage.

Early detection supports integrated pest management decisions.
"""
    },

    {
        "title": "Whitefly Monitoring",
        "plant": "General",
        "condition": "Whiteflies",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Whiteflies are small insects associated with plant foliage.

Regular inspection of leaves and plant growth can help detect
their presence.

Monitoring should record where insects are observed and
whether their activity is increasing.
"""
    },

    {
        "title": "Thrips Monitoring",
        "plant": "General",
        "condition": "Thrips",
        "category": "pest",
        "source_type": "pest",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Thrips are small insects that can damage plant tissues.

Monitoring should include inspection of young leaves, flowers,
and developing plant parts when relevant.

Damage should be recorded together with any visible insects
and changes over time.
"""
    },

    {
        "title": "Spider Mite Monitoring",
        "plant": "General",
        "condition": "Spider Mites",
        "category": "pest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Spider mites are very small pests that can affect plant leaves.

Monitoring should include inspection of leaf surfaces and
changes in leaf appearance.

Repeated monitoring is useful because pest activity can change
over time.
"""
    },


    # =================================================
    # 10. SEEDS AND SEEDLINGS
    # =================================================

    {
        "title": "Seed Selection",
        "plant": "General",
        "condition": "Seeds",
        "category": "seeds",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Good seed selection is an important starting point for crop
production.

Seeds should be appropriate for the intended crop and growing
conditions and should come from reliable sources.

Healthy planting material can support uniform establishment.
"""
    },

    {
        "title": "Seed Germination",
        "plant": "General",
        "condition": "Germination",
        "category": "seeds",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Seed germination depends on suitable moisture, temperature,
oxygen, and seed quality.

Excess moisture can create unfavorable conditions, while
insufficient moisture can prevent proper germination.

Germination should be monitored rather than assuming all seeds
will develop at the same rate.
"""
    },

    {
        "title": "Vegetable Seedling Management",
        "plant": "General",
        "condition": "Seedlings",
        "category": "seedlings",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Healthy seedlings require suitable moisture, light,
temperature, nutrition, and growing-medium conditions.

Seedlings should be monitored for weak growth, abnormal
coloration, excessive stretching, wilting, and disease symptoms.

Good airflow and careful water management are important during
seedling production.
"""
    },

    {
        "title": "Seedling Transplanting",
        "plant": "General",
        "condition": "Transplanting",
        "category": "seedlings",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Transplanting should be done carefully to minimize root and
plant damage.

After transplanting, plants should be monitored for water
stress, wilting, and adaptation to the new growing environment.

Healthy seedlings and suitable growing conditions support better
establishment.
"""
    },


    # =================================================
    # 11. GENERAL CULTIVATION
    # =================================================

    {
        "title": "General Plant Cultivation Guide",
        "plant": "General",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
General crop cultivation includes selecting suitable planting
material, preparing the growing environment, establishing
plants, managing water and nutrition, monitoring environmental
conditions, controlling weeds and pests, observing diseases,
and harvesting at an appropriate stage.

Specific practices should be adapted to the crop and growing
environment.
"""
    },

    {
        "title": "Plant Spacing",
        "plant": "General",
        "condition": "Plant Spacing",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Plant spacing influences light distribution, air circulation,
root competition, and access for monitoring and maintenance.

Appropriate spacing depends on the crop and growing system.

Overcrowding can make monitoring more difficult and may reduce
air movement around plants.
"""
    },

    {
        "title": "General Weed Management",
        "plant": "General",
        "condition": "Weeds",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Weed management reduces competition between weeds and crops for
water, nutrients, light, and space.

Regular observation and early management can help prevent weeds
from becoming difficult to control.

The appropriate approach depends on the production system and
crop.
"""
    },

    {
        "title": "Crop Monitoring",
        "plant": "General",
        "condition": "Crop Monitoring",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Crop monitoring combines observation of plant growth,
environmental conditions, pests, diseases, irrigation,
nutrition, and cultivation practices.

Regular monitoring helps identify changes early and supports
better management decisions.
"""
    },


    # =================================================
    # 12. TOMATO
    # =================================================

    {
        "title": "Tomato Cultivation Guide",
        "plant": "Tomato",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato production requires suitable light, soil or growing
medium, water management, nutrition, temperature, air
circulation, and regular monitoring.

Healthy seedlings should be established in a suitable growing
environment.

During growth, plants should be monitored for water stress,
nutritional problems, pests, diseases, flowering, and fruit
development.

Tomato cultivation can be carried out in open fields,
containers, or protected environments, but management should
be adapted to the production system.
"""
    },

    {
        "title": "Tomato Flowering and Fruit Development",
        "plant": "Tomato",
        "condition": "Flowering and Fruit Development",
        "category": "growth",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato flowering and fruit development are important stages
that should be monitored carefully.

Environmental conditions, plant nutrition, water management,
and overall plant health can influence flowering and fruit
development.

Monitoring should include flower formation, fruit development,
plant vigor, and any environmental changes occurring during
these stages.
"""
    },

    {
        "title": "Tomato Early Blight",
        "plant": "Tomato",
        "condition": "Early Blight",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato early blight can produce leaf symptoms and may affect
plant vigor.

Diagnosis should consider the appearance and progression of
leaf symptoms together with environmental conditions and other
evidence.

Good monitoring, sanitation, suitable air circulation, and
careful irrigation management are important components of plant
health management.
"""
    },

    {
        "title": "Tomato Late Blight",
        "plant": "Tomato",
        "condition": "Late Blight",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato late blight can cause serious plant damage and should be
monitored carefully.

Assessment should consider visible symptoms, their progression,
environmental conditions, and other evidence.

Early recognition and appropriate plant health management are
important when disease symptoms are suspected.
"""
    },

    {
        "title": "Tomato Yellow Leaves",
        "plant": "Tomato",
        "condition": "Yellow Leaves",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Yellow leaves in tomato plants can have multiple causes.

Possible factors to investigate include water management,
drainage, nutrition, environmental stress, root problems, and
disease.

The location and age of affected leaves should be observed,
along with soil moisture and recent management.
"""
    },

    {
        "title": "Tomato Wilting",
        "plant": "Tomato",
        "condition": "Wilting",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Tomato wilting can result from water stress or other plant
health problems.

Assessment should include soil moisture, irrigation history,
temperature, humidity, root condition, pests, diseases, and
recent environmental changes.

Wilting alone does not confirm one specific cause.
"""
    },


    # =================================================
    # 13. CORN
    # =================================================

    {
        "title": "Corn Cultivation Guide",
        "plant": "Corn",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Corn cultivation requires appropriate soil preparation,
establishment, water management, nutrition, light, and
monitoring.

Plants should be observed for growth problems, water stress,
nutrient problems, pests, and disease symptoms.

Management should be adapted to local growing conditions and
the crop production system.
"""
    },

    {
        "title": "Corn Common Rust",
        "plant": "Corn",
        "condition": "Common Rust",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Corn common rust produces visible symptoms on leaves.

Monitoring should focus on leaf appearance and progression of
symptoms.

Environmental conditions and overall plant health should also
be considered during assessment.
"""
    },

    {
        "title": "Corn Northern Leaf Blight",
        "plant": "Corn",
        "condition": "Northern Leaf Blight",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Corn northern leaf blight can produce characteristic leaf
symptoms.

Assessment should consider symptom appearance, progression,
environmental conditions, and other available evidence.

Regular crop monitoring supports earlier recognition of leaf
disease problems.
"""
    },

    {
        "title": "Corn Gray Leaf Spot",
        "plant": "Corn",
        "condition": "Gray Leaf Spot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Corn gray leaf spot affects corn leaves.

Monitoring should include regular inspection of leaves and
recording the appearance and progression of symptoms.

Environmental conditions and overall crop health should be
considered when assessing suspected disease.
"""
    },

    {
        "title": "Corn Leaf Problems",
        "plant": "Corn",
        "condition": "Leaf Problems",
        "category": "plant_health",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Corn leaf problems can be related to disease, pests,
environmental stress, water availability, or nutrition.

Assessment should consider symptom appearance, location,
progression, environmental conditions, soil moisture, and
management history.
"""
    },


    # =================================================
    # 14. OTHER CROPS
    # =================================================

    {
        "title": "Apple Cultivation Guide",
        "plant": "Apple",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Apple cultivation requires suitable environmental conditions,
soil, water management, nutrition, and regular monitoring.

Plant health should be observed throughout growth, flowering,
fruit development, and harvest.

Regular monitoring helps identify disease, pest, and
environmental problems.
"""
    },

    {
        "title": "Apple Scab",
        "plant": "Apple",
        "condition": "Apple Scab",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Apple scab can affect apple leaves and fruit.

Monitoring should focus on symptom appearance and progression
and should consider environmental conditions and plant health.

Good sanitation and regular monitoring are important components
of integrated plant health management.
"""
    },

    {
        "title": "Apple Black Rot",
        "plant": "Apple",
        "condition": "Black Rot",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Apple black rot can affect plant tissues and fruit.

Assessment should consider visible symptoms, progression, plant
condition, and environmental factors.

Regular inspection and sanitation are useful components of
general disease management.
"""
    },

    {
        "title": "Apple Cedar Apple Rust",
        "plant": "Apple",
        "condition": "Cedar Apple Rust",
        "category": "disease",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Cedar apple rust can produce visible symptoms on apple leaves
and other plant parts.

Monitoring should include regular inspection and observation
of symptom progression.

Diagnosis should consider symptoms together with environmental
and plant health information.
"""
    },

    {
        "title": "Potato Cultivation Guide",
        "plant": "Potato",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Potato production requires suitable soil preparation, planting
material, water management, nutrition, and monitoring.

Good drainage and appropriate soil conditions are important for
root and tuber development.

Plants should be monitored for pests, diseases, and stress.
"""
    },

    {
        "title": "Pepper Cultivation Guide",
        "plant": "Pepper",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Pepper cultivation requires suitable soil, water management,
light, temperature, nutrition, and monitoring.

Plants should be observed for environmental stress, pests,
disease symptoms, and fruit development.

Management should be adapted to the growing system.
"""
    },

    {
        "title": "Cucumber Cultivation Guide",
        "plant": "Cucumber",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Cucumber production requires suitable water management,
temperature, light, soil or growing medium, nutrition, and
air circulation.

Regular monitoring is important because cucumber plants can
respond quickly to changes in their growing environment.
"""
    },

    {
        "title": "Lettuce Cultivation Guide",
        "plant": "Lettuce",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Lettuce requires suitable growing conditions, water management,
light, soil or growing medium, and nutrition.

Consistent monitoring of moisture and plant growth can help
identify environmental stress early.
"""
    },

    {
        "title": "Onion Cultivation Guide",
        "plant": "Onion",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_url": "",
        "year": None,
        "content": """
Onion cultivation requires suitable soil conditions, water
management, nutrition, light, and monitoring.

Plant development should be observed throughout the growing
period, including signs of stress, pests, and disease.
"""
    },

    {
        "title": "Wheat Cultivation Guide",
        "plant": "Wheat",
        "condition": "Cultivation",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Wheat cultivation requires suitable soil preparation,
establishment, water management, nutrition, and crop monitoring.

Regular inspection helps identify unusual growth, pests,
disease symptoms, and environmental stress.
"""
    },


    # =================================================
    # 15. PLANT ENVIRONMENT
    # =================================================

    {
        "title": "Plant Temperature Management",
        "plant": "General",
        "condition": "Temperature",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Temperature affects plant growth and development.

Temperature management should consider crop requirements,
growth stage, humidity, ventilation, light, and other
environmental conditions.

Unexpected temperature changes should be monitored together
with plant responses.
"""
    },

    {
        "title": "Plant Humidity Management",
        "plant": "General",
        "condition": "Humidity",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Relative humidity influences the plant growing environment.

Humidity should be considered together with temperature,
ventilation, irrigation, plant density, and disease monitoring.

Persistent environmental imbalance should trigger closer
inspection of plant condition.
"""
    },

    {
        "title": "Plant Light Requirements",
        "plant": "General",
        "condition": "Light",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Light is essential for plant growth and development.

Light management should consider crop requirements and the
production environment.

Changes in light availability should be considered together
with plant growth and leaf development.
"""
    },

    {
        "title": "Plant Air Circulation",
        "plant": "General",
        "condition": "Air Circulation",
        "category": "environment",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Air circulation helps maintain the growing environment around
plants.

Good airflow should be considered together with greenhouse
design, temperature, humidity, plant density, and crop
requirements.

Poor air circulation can contribute to an unfavorable plant
environment.
"""
    },

    {
        "title": "Heat Stress in Plants",
        "plant": "General",
        "condition": "Heat Stress",
        "category": "stress",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Heat stress can affect plant growth and water balance.

Assessment should consider temperature, soil moisture,
humidity, plant condition, recent weather, and greenhouse
ventilation.

Heat-related symptoms should be interpreted together with
other environmental evidence.
"""
    },

    {
        "title": "Cold Stress in Plants",
        "plant": "General",
        "condition": "Cold Stress",
        "category": "stress",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Cold conditions can slow plant growth and affect plant
development.

Assessment should consider temperature history, crop
requirements, growth stage, and visible plant responses.

Cold stress should be distinguished from disease or nutrition
problems using multiple observations.
"""
    },


    # =================================================
    # 16. HARVEST
    # =================================================

    {
        "title": "Crop Harvest Monitoring",
        "plant": "General",
        "condition": "Harvest",
        "category": "harvest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Harvest monitoring involves observing crop maturity,
appearance, size, quality, and other crop-specific indicators.

Harvest timing should be based on the requirements of the
specific crop and intended use.

Regular monitoring helps identify when produce is approaching
the appropriate harvest stage.
"""
    },

    {
        "title": "Post-Harvest Crop Care",
        "plant": "General",
        "condition": "Post-Harvest",
        "category": "harvest",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Post-harvest handling aims to preserve produce quality and
reduce unnecessary damage.

Important considerations include careful handling, cleanliness,
appropriate storage conditions, and minimizing physical injury.

Specific storage requirements depend on the crop.
"""
    },


    # =================================================
    # 17. HOME GARDEN / CONTAINERS
    # =================================================

    {
        "title": "Home Garden Plant Care",
        "plant": "General",
        "condition": "Home Garden",
        "category": "home_gardening",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Home gardening requires attention to container or soil
conditions, light, water, drainage, nutrition, and plant
spacing.

Plants in small spaces should be monitored frequently because
environmental conditions can change quickly.

Regular observation helps identify stress, pests, and disease
symptoms early.
"""
    },

    {
        "title": "Container Plant Growing",
        "plant": "General",
        "condition": "Container Growing",
        "category": "home_gardening",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Container-grown plants depend heavily on the quality of the
growing medium, drainage, water management, container size,
light, and nutrition.

Containers can dry out or remain wet differently from open
soil, so regular observation of moisture and plant condition
is important.
"""
    },


    # =================================================
    # 18. SMART AGRICULTURE
    # =================================================

    {
        "title": "Smart Plant Monitoring",
        "plant": "General",
        "condition": "Smart Monitoring",
        "category": "smart_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Smart plant monitoring combines sensor measurements,
environmental observations, plant observations, and records.

A monitoring system can help identify changes in temperature,
humidity, soil moisture, light, irrigation conditions, and
plant health.

The purpose of smart monitoring is to support earlier
observation and better decisions. It should not automatically
treat a sensor value as a confirmed diagnosis.
"""
    },

    {
        "title": "Agricultural Decision Making",
        "plant": "General",
        "condition": "Decision Making",
        "category": "smart_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Agricultural decisions should consider multiple evidence
sources.

Useful evidence can include plant observations, environmental
measurements, irrigation history, soil condition, pest
observations, disease symptoms, crop stage, and previous
records.

When evidence is incomplete, additional monitoring and
inspection may be preferable to making an unsupported
conclusion.
"""
    },

    {
        "title": "Plant Monitoring Decision Workflow",
        "plant": "General",
        "condition": "Monitoring Decision",
        "category": "smart_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
A practical plant monitoring decision workflow can be:

1. Observe the plant.
2. Check current environmental conditions.
3. Review recent measurements and records.
4. Check irrigation and management history.
5. Look for pests or disease symptoms.
6. Compare current observations with previous observations.
7. Identify unusual or persistent changes.
8. Investigate possible causes.
9. Apply only supported management actions.
10. Continue monitoring after the action.

The workflow helps separate observation from diagnosis and
reduces decisions based on a single signal.
"""
    },


    # =================================================
    # 19. GENERAL AGRICULTURAL QUESTIONS
    # =================================================

    {
        "title": "Choosing a Crop",
        "plant": "General",
        "condition": "Crop Selection",
        "category": "cultivation",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Crop selection should consider climate, soil, available water,
light, growing space, production system, management capacity,
and intended use.

A crop should be selected based on the suitability of the
growing environment rather than preference alone.
"""
    },

    {
        "title": "General Agricultural Decision Making",
        "plant": "General",
        "condition": "Agricultural Decision Making",
        "category": "general_agriculture",
        "source_type": "khadrwy_knowledge",
        "source_name": "Khadrwy Agricultural Knowledge Base",
        "source_url": "",
        "year": None,
        "content": """
Agricultural decisions should be based on the crop,
environment, available observations, and reliable information.

When information is incomplete, additional observation or
expert assessment may be appropriate.

Avoid making major decisions based on a single symptom,
single sensor reading, or unsupported assumption.
"""
    },

]


# =====================================================
# DOCUMENT ACCESS FUNCTION
# =====================================================

def get_documents():
    """
    Return all agricultural knowledge documents.
    """

    return documents