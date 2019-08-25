"C:\Program Files (x86)\Java\jre6\bin\"java.exe -jar cc.jar --js ..\dic.js --js_output_file dic.js --charset UTF-8 --compilation_level ADVANCED_OPTIMIZATIONS --property_map_output_file cc
"C:\Program Files (x86)\Java\jre6\bin\"java.exe -jar cc.jar --js ..\dic.ru.js --js_output_file dic.ru.js --charset UTF-8 --compilation_level ADVANCED_OPTIMIZATIONS --property_map_input_file cc

"C:\Program Files (x86)\Java\jre6\bin\"java.exe -jar cc.jar --js ..\mini.js --js_output_file mini.js --charset UTF-8 --compilation_level ADVANCED_OPTIMIZATIONS --property_map_input_file cc

move /y *.js ..
del cc.
