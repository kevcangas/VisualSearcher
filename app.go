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

///////////////// Class Sorter /////////////////////////////

type Sorter struct {
	vector       []int
	vectorSize   int
	steps        [][]int
	currentValue [][]int
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
	s.currentValue = [][]int{}
	for i := 1; i < s.vectorSize; i++ {
		aux := s.vector[i]
		k := i - 1
		sw := false
		for !sw && k >= 0 {
			if aux < s.vector[k] {
				s.vector[k+1] = s.vector[k]
				s.currentValue = append(s.currentValue, []int{aux})
				s.steps = append(s.steps, append([]int(nil), s.vector...))
				k = k - 1
				//fmt.Println("Vector: ", saver)
			} else {
				sw = true
			}
		}
		s.vector[k+1] = aux
	}

	return s.steps
}

func (s *Sorter) ShellMethod() [][]int {
	s.steps = [][]int{}
	s.currentValue = [][]int{}
	jump := s.vectorSize / 2
	var i, j, k, aux int
	for jump > 0 {
		for i = jump; i < s.vectorSize; i++ {
			j = i - jump
			for j >= 0 {
				k = j + jump
				s.steps = append(s.steps, append([]int(nil), s.vector...))
				s.currentValue = append(s.currentValue, []int{aux})
				if s.vector[j] < s.vector[k] {
					j = 0
				} else {
					aux = s.vector[j]
					s.vector[j] = s.vector[k]
					s.vector[k] = aux
				}
				j = j - jump
			}
		}
		if jump == 1 {
			break
		}
		jump = (1 + jump) / 2
		//fmt.Println("Salto: ", jump, "Vector: ", s.vector)
	}
	return s.steps
}

func (s *Sorter) SortBySelectionMethod() [][]int {
	s.steps = [][]int{}
	s.currentValue = [][]int{}
	for i := 0; i < s.vectorSize; i++ {
		aux := s.vector[i]
		k := i
		j := i
		for j < s.vectorSize {
			if s.vector[j] < aux {
				aux = s.vector[j]
				k = j
			}
			s.steps = append(s.steps, append([]int(nil), s.vector...))
			s.currentValue = append(s.currentValue, []int{aux})
			j = j + 1
		}
		s.vector[k] = s.vector[i]
		s.vector[i] = aux
	}

	return s.steps
}

func (s *Sorter) BubbleMethod() [][]int {
	s.steps = [][]int{}
	s.currentValue = [][]int{}
	flag := false
	var aux int
	i := 0
	for i < s.vectorSize && !flag {
		flag = true
		for j := 0; j < s.vectorSize-1-i; j++ {
			if s.vector[j] > s.vector[j+1] {
				aux = s.vector[j]
				s.vector[j] = s.vector[j+1]
				s.vector[j+1] = aux
				flag = false
			}
			s.steps = append(s.steps, append([]int(nil), s.vector...))
			s.currentValue = append(s.currentValue, []int{aux})
		}
		i++
	}

	return s.steps
}

func (s *Sorter) partition(low int, high int) int {
	pivot := s.vector[high]
	i := low
	for j := i; j <= high; j++ {
		if s.vector[j] < pivot {
			s.vector[i], s.vector[j] = s.vector[j], s.vector[i]
			i++
		}
		s.steps = append(s.steps, append([]int(nil), s.vector...))
		s.currentValue = append(s.currentValue, []int{pivot})
	}
	s.vector[i], s.vector[high] = s.vector[high], s.vector[i]
	return i
}

func (s *Sorter) quickSortCode(low int, high int) {
	var p int
	if low < high {
		p = s.partition(low, high)
		s.quickSortCode(low, p-1)
		s.quickSortCode(p+1, high)
	}
}

func (s *Sorter) QuickSort() [][]int {
	s.steps = [][]int{}
	s.currentValue = [][]int{}
	s.quickSortCode(0, s.vectorSize-1)
	return s.steps
}

func (s *Sorter) GetCurrentValue() [][]int {
	return s.currentValue
}
