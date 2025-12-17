import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, Trash2 } from 'lucide-react-native';
import { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onNoteClick: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
  formatDate: (date: string) => string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected,
  onNoteClick,
  onDeleteNote,
  formatDate,
}) => {
  const getDisplayDate = (note: Note) => {
    const isUpdated =
      note.updatedAt && note.createdAt && note.updatedAt !== note.createdAt;
    return isUpdated
      ? formatDate(note.updatedAt ?? note.date)
      : note.createdAt
      ? formatDate(note.createdAt ?? note.date)
      : formatDate(note.date);
  };

  const getDateLabel = (note: Note) => {
    return note.updatedAt && note.createdAt && note.updatedAt !== note.createdAt
      ? 'Updated'
      : 'Created';
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onNoteClick(note)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {note.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: note.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cameraIcon}>
              <Camera size={14} color="#fff" />
            </View>
          </View>
        )}
        <Text style={styles.noteText} numberOfLines={3}>
          {note.note}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={e => {
              e.stopPropagation();
              onDeleteNote(note);
            }}
          >
            <Trash2 size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.timestamp}>
        {getDateLabel(note)}: {getDisplayDate(note)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  content: {
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cameraIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  noteText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  deleteButton: {
    padding: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default NoteCard;
