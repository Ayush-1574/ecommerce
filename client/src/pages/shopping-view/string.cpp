#include<bits/stdc++.h>

using namespace std;

int main(){
    string s = "3[a2[c]]";
    


    stack<char> st;
    string fans;
    int n = s.size();
    cout << "ji";
    string temp = "";
    for(int i = 0 ;  i< n ; i++ ){
        if(st.empty()) st.push(s[i]);

        if(s[i] != '['){
            st.push(s[i]);
        }

        cout << "HI";

        else {
            
            while(st.top() != '['){
                temp = st.top() + temp;
                st.pop();
            }
            st.pop();
            string num;
            int numb = 0;
            while(st.top() >=  '1'  && st.top() <= '9'){
                numb = (s[i] - '0')  + numb * 10;
                st.pop();
                cout << "hi";
            }

            
            string ans;
            for(int i = 0 ; i < numb ; i++){
                ans = temp + ans;
            }
            cout << "hidd";

            temp = ans;

            fans = temp;
        }

    }

    cout << temp;
    return 0;
}


// "3[a2[c]]"