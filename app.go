package main

import (
	"context"
	"fmt"
	"math/rand"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Class Sorter

type Sorter struct {
	vector     []int
	vectorSize int
	steps      [][]int
}

func NewSorter() *Sorter {
	return &Sorter{}
}

func (s *Sorter) VectorGen(sliceSize int) []int {

	// Create a slice of integers
	randomNumbers := make([]int, sliceSize)

	// Populate the slice with random numbers
	for i := 0; i < sliceSize; i++ {
		// Generate a random integer between 0 (inclusive) and 100 (exclusive)
		randomNumbers[i] = rand.Intn(100)
	}

	s.vector = randomNumbers
	s.vectorSize = len(s.vector)

	return s.vector
}

func (s *Sorter) InsertMethod() [][]int {
	s.steps = [][]int{}
	saver := s.vector
	for i := 1; i < s.vectorSize; i++ {
		aux := s.vector[i]
		k := i - 1
		sw := false
		for !sw && k >= 0 {
			if aux < s.vector[k] {
				s.vector[k+1] = s.vector[k]
				k = k - 1
				s.steps = append(s.steps, append([]int(nil), s.vector...))
				//fmt.Println("Vector: ", saver)
			} else {
				sw = true
			}
		}
		s.vector[k+1] = aux
	}

	fmt.Println("Steps: ", s.steps)
	_ = copy(s.vector, saver) //Resets the value of the vector
	return s.steps
}
