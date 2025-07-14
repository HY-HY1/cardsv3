# Import Libraries
import random
import math
import statistics

# Create Card Ranking Algorithm
# Use The CRA to return a valid Stack Of Cards

# TODO Create A Card Class With PSEUDO Data 

class Card:
    def __init__(self, data):
        self.data = data
        self.attempts = random.randint(0, 20)
        self.correct = random.randint(0, self.attempts) + 1  # For abstraction, remove possibility of 0 division
        self.time_since = random.randint(0, 20)  # 50 day Default
        self.prev_correct = random.choice([True, False])
        self.time_spent = random.randint(0, 60)  # 60 is default 
        self.score = 0
    
    def set_score(self, new):
        self.score = new
        # print(f"Updated Score 2: {new}")

# TODO Create The CRA Class - Add Methods to perform the mathematical calculations

class CRA:
    def __init__(self, card):
        self.score = 0  # Returns Score between 0-5  
        self.card_pointer = card
        self.correct_ratio = 0
        self.time_since_factor = 0
        self.hesitation_factor = 0
        
        self.dampening_factor = 0.05
        
    def CRF(self):  # Calculate Correct Ratio Factor
        self.correct_ratio = self.card_pointer.attempts / self.card_pointer.correct
        return self.correct_ratio
    
    def TSF(self):  # Calculate Time Since Factor
        self.time_since_factor = math.exp(-self.dampening_factor * self.card_pointer.time_since)
        # print("Time Since Factor", self.time_since_factor)
        return self.time_since_factor
    
    def HF(self):  # Calculate Hesitation Factor
        hesitation = 30 - self.card_pointer.time_spent  # 30 seconds - time spent in seconds
        if hesitation < 0:
            hesitation = 0  # No negative values
        
        hesitation_in_minutes = hesitation / 60
        
        self.hesitation_factor = hesitation_in_minutes + 0.5  # 0.5 is the max punishment        
        return self.hesitation_factor
    
    def Weighting(self):  # Calculate Final Score
        result = 5 * (self.HF() * self.TSF() * self.CRF())
        
        if self.card_pointer.prev_correct == True:
            result += 2
        
        self.score = round(result, 1)
        if self.score > 5:
            self.score = 5  # Prevent scores larger than 5
        
        self.card_pointer.set_score(self.score)
        
        return self.score

# TODO Create A Stack Class Which Holds Children

class Stack:
    def __init__(self):
        self.cards = []
        self.amount = 50
        self.mean_score = 0
        self.std_dev = 0
        self.new_card = None
        
        for i in range(self.amount):
            new_card = Card(str(i))
            self.cards.append(new_card)

    def rank_cards(self):
        for i in range(self.amount):
            self.new_card = CRA(self.cards[i])
            score = self.new_card.Weighting()
            self.cards[i].score = score  # Assign score to the card
            # print(f"Card {i}: {score}")
        
        self.calculate_statistics()  # Only call once, after all scores set

    def calculate_statistics(self):
        scores = []

        for i in range(len(self.cards)):
            if hasattr(self.cards[i], 'score'):
                scores.append(self.cards[i].score)

        print("Scores:", scores)

        if scores:
            self.mean_score = sum(scores) / len(scores)
            self.std_dev = round(statistics.stdev(scores),2) if len(scores) > 1 else 0
            print("Mean Score:", round(self.mean_score,2))
            print("STD_DEV:", self.std_dev)
        else:
            print("No scores found.")

s = Stack()
s.rank_cards()

# TODO Create A Card Selection Algorithm that selects 10 Cards

import random

class CSA:
    def __init__(self, stack):
        self.low = 0
        self.high = 0
        self.stack_pointer = stack

        self.high_arr = []
        self.average_arr = []
        self.low_arr = []
        
        self.cards_arr = []
        self.calculate_distribution()
        
    def calculate_distribution(self):
        sd = self.stack_pointer.std_dev
        mean = self.stack_pointer.mean_score

        self.low = mean - sd
        self.high = mean + sd

        self.sort_cards()

    def sort_cards(self):
        for i in range(self.stack_pointer.amount):
            cards = self.stack_pointer.cards
            if cards[i].score < self.low:
                self.low_arr.append(cards[i])
            elif cards[i].score > self.high:
                self.high_arr.append(cards[i])
            else:
                self.average_arr.append(cards[i])
        print(f"high_arr {[card.score for card in self.high_arr]}")
        print(f"avg_arr {[card.score for card in self.average_arr]}")
        print(f"low_arr {[card.score for card in self.low_arr]}")

    def get_cards(self, amount):
        outliers_amount = int(amount * 0.2)
        average_amount = amount - 2 * outliers_amount

        random.shuffle(self.high_arr)
        random.shuffle(self.low_arr)
        random.shuffle(self.average_arr)

        high_cards = self.high_arr[:outliers_amount]
        low_cards = self.low_arr[:outliers_amount]
        average_cards = self.average_arr[:average_amount]

        if len(high_cards) < outliers_amount:
            needed = outliers_amount - len(high_cards)
            extra_from_avg = self.average_arr[outliers_amount:outliers_amount + needed]
            high_cards.extend(extra_from_avg)
            average_cards = average_cards[len(extra_from_avg):]

        if len(low_cards) < outliers_amount:
            needed = outliers_amount - len(low_cards)
            extra_from_avg = self.average_arr[outliers_amount:outliers_amount + needed]
            low_cards.extend(extra_from_avg)
            average_cards = average_cards[len(extra_from_avg):]

        selected = high_cards + low_cards + average_cards

        if len(selected) < amount:
            repeats = (amount // len(selected)) + 1
            selected = (selected * repeats)[:amount]
        else:
            selected = selected[:amount]

        return selected


csa = CSA(s)
cards = csa.get_cards(10)
print(f"Selected cards scores: {[card.score for card in cards]}")

class SelectedCards:
    def __init__(self):
        self.cards = []
        self.csa = CSA(s)
    
    def get_cards(self, amount):
        self.cards = self.csa.get_cards(amount)
        return self.cards