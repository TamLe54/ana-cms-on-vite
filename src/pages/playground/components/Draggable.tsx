import { initialState } from "./initialState";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
  DropResult,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface ChapterProps {
  name?: string;
  id: string;
  content?: string;
  index: number;
}

interface JourneyProps {
  id: string;
  title: string;
  chapters: ChapterProps[];
}

const Chapter = ({ id, content, index }: ChapterProps) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className="border-black  border-2 p-4 w-full h-fit text-lg transition-[300ms]"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
};

const Journey = ({ id, title, chapters }: JourneyProps) => {
  return (
    <div className="border-black border-2 transition-[300ms] flex flex-col p-4 gap-6 w-fit h-fit min-w-[500px] min-h-[200px]">
      <h2 className="text-2xl">{title}</h2>
      <StrictModeDroppable droppableId={id}>
        {(provided) => {
          return (
            <div
              className="flex flex-col gap-2 w-full h-full grow transition-[300ms]"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {chapters.map((chapter, index) => {
                return (
                  <Chapter
                    key={chapter.id}
                    id={chapter.id}
                    content={chapter.content}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

const Dragging = () => {
  const [dragState, setDragState] = useState(initialState);

  // interface ResultProps {
  //   draggableId: string;
  //   type: string;
  //   reason: string;
  //   source: {
  //     droppableId: string;
  //     index: number;
  //   };
  //   destination: {
  //     droppableId: "column-1";
  //     index: 1;
  //   };
  // }

  const onDragEnd = (result: DropResult): void => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = dragState.journeys.find(
      (journey) => journey.id === source.droppableId
    ) ?? { id: "", title: "", chapters: [""] };
    const finish = dragState.journeys.find(
      (journey) => journey.id === destination.droppableId
    ) ?? { id: "", title: "", chapters: [""] };

    if (start === finish) {
      const newChapters = Array.from(start.chapters);
      newChapters.splice(source.index, 1);
      newChapters.splice(destination.index, 0, draggableId);

      const newJourney = {
        ...start,
        chapters: newChapters,
      };

      const newJourneys = dragState.journeys.map((journey) => {
        if (journey.id !== newJourney.id) return journey;
        return newJourney;
      });

      const newState = {
        ...dragState,
        journeys: newJourneys,
      };

      setDragState(newState);
      return;
    }

    // Moving from one list to another
    const startChapters = Array.from(start.chapters);
    startChapters.splice(source.index, 1);
    const newStartJourney = {
      ...start,
      chapters: startChapters,
    };

    const finishChapters = Array.from(finish.chapters);
    finishChapters.splice(destination.index, 0, draggableId);
    const newFinishJourney = {
      ...finish,
      chapters: finishChapters,
    };

    const newJourneys = dragState.journeys.map((journey) => {
      if (journey.id === newStartJourney.id) return newStartJourney;
      if (journey.id === newFinishJourney.id) return newFinishJourney;
      return journey;
    });

    const newState = {
      ...dragState,
      journeys: newJourneys,
    };
    setDragState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row gap-6">
        {dragState.journeys.map((journey, index) => {
          const chapters = journey.chapters.map((chapterID) => {
            return dragState.chapters.find(
              (chapter) => chapter.id === chapterID
            );
          });

          const chapterProps = chapters.map((chapter) => {
            return {
              id: chapter === undefined ? "" : chapter.id,
              name: chapter === undefined ? "" : chapter.name,
              content: chapter?.content,
              index: 0,
            } as ChapterProps;
          });

          return (
            <Journey
              key={index}
              id={journey.id}
              title={journey.title}
              chapters={chapterProps}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Dragging;
