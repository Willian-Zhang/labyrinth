#include <CapacitiveSensor.h>

int emit_port = 2;
CapacitiveSensor   cs_4 = CapacitiveSensor(emit_port,4);        // 10M resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor   cs_5 = CapacitiveSensor(emit_port,5);        // 10M resistor between pins 4 & 6, pin 6 is sensor pin, add a wire and or foil
CapacitiveSensor   cs_6 = CapacitiveSensor(emit_port,6);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil
CapacitiveSensor   cs_7 = CapacitiveSensor(emit_port,7);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil
//CapacitiveSensor   cs_8 = CapacitiveSensor(emit_port,8);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil

int buttonPort1 =  10;

void setup()                    
{
//   cs .                                _4.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example
   Serial.begin(9600);
   pinMode(buttonPort1, INPUT);
}

void loop()                    
{
    long start = millis();
    long total1 =  cs_4.capacitiveSensor(30);
    long total2 =  cs_5.capacitiveSensor(30);
    long total3 =  cs_6.capacitiveSensor(30);
    long total4 =  cs_7.capacitiveSensor(30);
//    long total5 =  cs_8.capacitiveSensor(30);

    Serial.print(millis() - start);        // check on performance in milliseconds
    Serial.print("\t");                    // tab character for debug windown spacing

    Serial.print(digitalRead(buttonPort1));
    Serial.print("\t");
    Serial.print(total1);                 
    Serial.print("\t");
    Serial.print(total2);                 
    Serial.print("\t");  
    Serial.print(total3);
    Serial.print("\t");
    Serial.print(total4);                
//    Serial.print("\t");  
//    Serial.print(total5);
    Serial.print("\n");  
    
    delay(10);                             // arbitrary delay to limit data to serial port 
}
