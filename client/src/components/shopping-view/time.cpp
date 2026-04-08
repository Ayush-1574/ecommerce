#include<bits/stdc++.h>
using namespace std;
class MinHeap{
    public:
        vector<int> heap;
        int size;

         MinHeap(){
            size = 0;
        }

        void insert(int key){
            heap.push_back(key);
            int index = size;
            int parent = (index - 1 )/ 2;
            while(parent >= 0 && heap[parent] > heap[index]){
                swap(heap[parent] , heap[index]);
                index = parent;
                parent = (index - 1) / 2;
            }
            size++;
        }

        void changeKey(int index, int new_val){
            heap[index] = new_val;
            //cout << "NewVal  " << size ;
             while(index* 2 + 2 <= size && (heap[index] > heap[index *2 + 1] || heap[index] > heap[index*2 + 2])){
                if(heap[index * 2 + 1] < heap[index *2 + 2]){
                    swap(heap[index * 2 + 1] , heap[index]);
                    index = index * 2 + 1;
                }
                else{
                    swap(heap[index * 2 + 2] , heap[index]);
                    index = index * 2 + 2;  
                }
            }

            if(index * 2 + 1 < size){
                if(heap[index] > heap[index*2 + 1]){
                    swap(heap[index] , heap[index * 2 + 1]);
                }
            }



        }

        void extractMin(){
            if(size == 0) return;
            swap(heap[0] , heap[size - 1]);
            size--;
            int index = 0;
            while(index* 2 + 2 <= size && (heap[index] > heap[index *2 + 1] || heap[index] > heap[index*2 + 2])){
                if(heap[index * 2 + 1] < heap[index *2 + 2]){
                    swap(heap[index * 2 + 1] , heap[index]);
                    index = index * 2 + 1;
                }
                else{
                    swap(heap[index * 2 + 2] , heap[index]);
                    index = index * 2 + 2;  
                }
            }

            if(index * 2 + 1 < size){
                if(heap[index] > heap[index*2 + 1]){
                    swap(heap[index] , heap[index * 2 + 1]);
                }
            }

        }

        bool isEmpty(){
            if(size == 0) return true;
            return false;
        }

        int getMin(){
            return heap[0];
        }

        int heapSize(){
            return size;
        }

        void printHeap(){
            for(int i = 0 ; i < size ; i++){
                cout << heap[i] << " "; 
            }
        }
};

int main(){
    MinHeap h;
    h.insert(10);
    h.insert(3);
    h.insert(15);
    h.insert(5);


    h.changeKey(0 , 20);
    h.extractMin();
    cout << h.getMin();
    h.printHeap();

}