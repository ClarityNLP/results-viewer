const algorithmParameters = {
  MeasurementFinder: [
    "sentence",
    "text",
    "start",
    "end",
    "value",
    "term",
    "dimension_X",
    "dimension_Y",
    "dimension_Z",
    "units",
    "location",
    "condition",
    "temporality",
    "min_value",
    "max_value"
  ],
  NamedEntityRecognition: [
    "term",
    "text",
    "start",
    "end",
    "label",
    "description"
  ],
  Ngram: ["text", "count"],
  POSTagger: [
    "sentence",
    "term",
    "text",
    "lemma",
    "pos",
    "tag",
    "dep",
    "shape",
    "is_alpha",
    "is_stop",
    "description"
  ],
  ProviderAssertion: [
    "sentence",
    "section",
    "term",
    "start",
    "end",
    "negation",
    "temporality",
    "experiencer"
  ],
  TermProximityTask: [
    "sentence",
    "start",
    "end",
    "value",
    "word1",
    "word2",
    "start1",
    "start2",
    "end1",
    "end2"
  ],
  TermFinder: [
    "sentence",
    "section",
    "term",
    "start",
    "end",
    "negation",
    "temporality",
    "experiencer"
  ],
  ValueExtraction: [
    "sentence",
    "text",
    "start",
    "end",
    "value",
    "term",
    "dimension_X",
    "dimension_Y",
    "dimension_Z",
    "units",
    "location",
    "condition",
    "temporality",
    "min_value",
    "max_value"
  ],
  GleasonScoreTask: [
    "sentence",
    "start",
    "end",
    "value",
    "value_first",
    "value_second"
  ],
  RaceFinderTask: ["sentence", "start", "end", "value", "value_normalized"],
  PFTFinder: [
    "sentence",
    "start",
    "end",
    "fev1_condition",
    "fev1_units",
    "fev1_value",
    "fev1_text",
    "fev1_count",
    "fev1_fvc_ratio_count",
    "fev1_fvc_condition",
    "fev1_fvc_units",
    "fev1_fvc_value",
    "fev1_fvc_text",
    "fvc_count",
    "fvc_condition",
    "fvc_units",
    "fvc_value",
    "fvc_text"
  ],
  TextStats: [
    "avg_word_cnt",
    "avg_grade_level",
    "avg_sentences",
    "avg_long_words",
    "avg_polysyllable_words"
  ],
  TNMStager: [
    "text",
    "start",
    "end",
    "t_prefix",
    "t_code",
    "t_certainty",
    "t_suffixes",
    "t_multiplicity",
    "n_prefix",
    "n_code",
    "n_certainty",
    "n_suffixes",
    "n_regional_nodes_examined",
    "n_regional_nodes_involved",
    "m_prefix",
    "m_code",
    "m_certainty",
    "m_suffixes",
    "l_code",
    "g_code",
    "v_code",
    "pn_code",
    "serum_code",
    "r_codes",
    "r_suffixes",
    "r_locations",
    "stage_prefix",
    "stage_number",
    "stage_letter"
  ],
  TransfusionNursingNotesParser: [
    "reaction",
    "elapsedMinutes",
    "transfusionStart",
    "transfusionEnd",
    "bloodProductOrdered",
    "dateTime",
    "timeDeltaMinutes",
    "dryWeightKg",
    "heightCm",
    "tempF",
    "tempC",
    "heartRate",
    "respRateMachine",
    "respRatePatient",
    "nibpSystolic",
    "nibpDiastolic",
    "nibpMean",
    "arterialSystolic",
    "arterialDiastolic",
    "arterialMean",
    "bloodGlucose",
    "cvp",
    "spO2",
    "oxygenFlow",
    "endTidalCO2",
    "fiO2"
  ]
};

export default algorithmParameters;
