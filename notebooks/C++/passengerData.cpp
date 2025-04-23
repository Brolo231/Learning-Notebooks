#include <iostream>
#include <fstream>
using namespace std;

int main(){

    // File Input:
    ofstream myFile("passengerData.txt");
    if(myFile.is_open()){
        cout << "File successfully opened!\n\n";
        myFile << 1 << "," << 2 << "\n";
        myFile << 3 << "," << 1 << "\n";
        myFile << 5 << "," << 3 << "\n";
        myFile.close();
    }else{
        cout << "Error opening/creating file\n\n";
    }

    // File Output:
    ifstream myFileRead("passengerData.txt");
    string line;
    if(myFileRead.is_open()){
        cout << "File successfully opened for reading\n\n";
        while(getline(myFileRead, line)){
            cout << line << "\n";
        }
        myFileRead.close();
    }else{
        cout << "Error opening file for reading\n\n";
    }


    // Reading each character:
    ifstream myCharacters("passengerData.txt");
    if(myCharacters.is_open()){
        int i;
        cout << "\n";
        while(getline(myCharacters, line)){
            for(i = 0; i < line.size(); i++){
                if(line[i] != ','){
                    cout << line[i] << " ";
                }
            }
        }
    }else{
        cout << "Error reading individual characters";
    }

    return 0;
}
