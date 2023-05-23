// 0: Stopped, 1: Playing, 2: Paused
// TODO: Change to strings
// export type PlaybackState = 0 | 1 | 2;

import { StoreState } from "@Data/Store";
import { ChildTimeBlock } from "@Interfaces/ChildEntity";
import { Note } from "@Interfaces/Note";
import { Part } from "@Interfaces/Part";
import { TimeBlock } from "@Interfaces/TimeBlock";
import { Track } from "@Interfaces/Track";

export type Dimension = string | number;

export type PartialState =
    | StoreState
    | Partial<StoreState>
    | ((state: StoreState) => StoreState | Partial<StoreState>);

export type Id = number;

export type TrackMap = Map<Id, Track>;
export type TrackRecord = [Id, Track];

export type PartMap = Map<Id, Part>;
export type PartRecord = [Id, Part];

export type NoteMap = Map<Id, Note>;
export type NoteRecord = [Id, Note];

export type TimeBlockMap = Map<Id, TimeBlock>;
export type TimeBlockRecord = [Id, TimeBlock];

export type ChildTimeBlockMap = Map<Id, ChildTimeBlock>;
export type ChildTimeBlockRecord = [Id, ChildTimeBlock];

export type Entity = Track | Part | Note;
export type EntityMap = Map<Id, Entity>;
export type EntityRecord = [Id, Entity];

export type Container = Track | Part;
export type ContainerMap = Map<Id, Container>;
export type ContainerRecord = [Id, Container];
