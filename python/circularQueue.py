from algorithms import SelectedCards

sc = SelectedCards()
print(f"Cards In CQ: {sc.get_cards(10)}")


class CircularQueue:
    def __init__(self):
        self.size = 10
        self.queue = sc.get_cards(self.size)
        self.front = 0

        if None in self.queue:
            self.rear = self.queue.index(None) - 1
        else:
            self.rear = self.size - 1

    def isEmpty(self):
        return self.queue[self.front] is None

    def isFull(self):
        return self.queue[(self.rear + 1) % self.size] is not None

    def enqueue(self, item):
        if self.isFull():
            print("Queue is Full")
            return
        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = item
        print(f"Enqueued: {item} | Front: {self.front}, Rear: {self.rear}")

    def dequeue(self):
        if self.isEmpty():
            print("Nothing to dequeue.")
            return
        removed = self.queue[self.front]
        self.queue[self.front] = None
        self.front = (self.front + 1) % self.size
        print(f"Dequeued: {removed} | Front: {self.front}, Rear: {self.rear}")
        self.traverse_queue()

    def send_to_back(self):
        if self.isEmpty():
            print("Queue is empty, cannot send to back.")
            return
        item = self.queue[self.front]
        self.queue[self.front] = None
        self.front = (self.front + 1) % self.size
        if self.isFull():
            print("Queue is full, cannot send to back.")
            return
        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = item
        print(f"Sent to back: {item} | Front: {self.front}, Rear: {self.rear}")
        self.traverse_queue()

    def traverse_queue(self):
        data_queue = []
        for item in self.queue:
            if item is None:
                data_queue.append(None)
            elif hasattr(item, 'data'):
                data_queue.append(item.data)
            else:
                data_queue.append(item)
        print("Queue:", data_queue)


cq = CircularQueue()

def cli():
    while True:
        print(cq.traverse_queue())
        print("\nOptions:")
        print("1 - Dequeue")
        print("2 - Send front item to back")
        print("3 - Enqueue")
        print("q - Quit")

        choice = input("Enter your choice: ").strip()

        if choice == '1':
            cq.dequeue()
        elif choice == '2':
            cq.send_to_back()
        elif choice == '3':
            item = input("Enter item to enqueue: ")
            cq.enqueue(item)
        elif choice.lower() == 'q':
            print("Exiting CLI.")
            break
        else:
            print("Invalid option. Please try again.")


cli()

    
