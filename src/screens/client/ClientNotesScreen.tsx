import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, ArrowLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import DeleteModal from '../../components/clients/DeleteModal';
import NoteCard from '../../components/clients/NoteCard';
import { Note } from '../../types';
import {
  getCustomerNotes,
  addCustomerNote,
  updateCustomerNote,
  deleteCustomerNote,
} from '../../services/artistServices';

interface ClientNotesScreenProps {}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ClientNotesScreen: React.FC<ClientNotesScreenProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { clientId, client } = route.params as {
    clientId: string;
    client?: any;
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadNotes();
    }
  }, [clientId]);

  // Refresh notes when returning from add/edit screen
  useFocusEffect(
    useCallback(() => {
      if (clientId) {
        loadNotes();
      }
    }, [clientId]),
  );

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await getCustomerNotes(clientId);
      setNotes(response.data?.notes || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load notes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async (noteContent: string, imageUrl?: string) => {
    try {
      const response = await addCustomerNote(clientId, {
        note: noteContent,
        imageUrl,
      });
      const newNote = response.data.note;
      setNotes(prev => [newNote, ...prev]);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Note added successfully',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save note',
      });
      throw error;
    }
  };

  const handleUpdateNote = async (noteId: string, noteContent: string, imageUrl?: string) => {
    try {
      await updateCustomerNote(clientId, noteId, {
        note: noteContent,
        imageUrl,
      });
      setNotes(prev =>
        prev.map(n =>
          n.id === noteId
            ? {
                ...n,
                note: noteContent,
                imageUrl,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Note updated successfully',
      });
    } catch (error) {
      console.error('Error updating note:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update note',
      });
      throw error;
    }
  };

  const handleAddNote = () => {
    navigation.navigate('AddNote', {
      clientId,
      onSave: handleSaveNote,
    });
  };

  const handleNoteClick = (note: Note) => {
    navigation.navigate('AddNote', {
      clientId,
      note,
      onSave: async (noteContent: string, imageUrl?: string) => {
        await handleUpdateNote(note.id, noteContent, imageUrl);
      },
    });
  };

  const handleDeleteNote = (note: Note) => {
    setSelectedNote(note);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedNote) {
      try {
        await deleteCustomerNote(clientId, selectedNote.id);
        setNotes(prev => prev.filter(n => n.id !== selectedNote.id));
        setShowDeleteModal(false);
        setSelectedNote(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Note deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting note:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete note',
        });
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {client?.name || 'Client'}'s Notes
          </Text>
          <Text style={styles.headerSubtitle}>
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No notes yet</Text>
      <Text style={styles.emptyStateText}>
        Add notes about this client to keep track
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8e2d8e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            isSelected={selectedNote?.id === item.id}
            onNoteClick={handleNoteClick}
            onDeleteNote={handleDeleteNote}
            formatDate={formatDate}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          notes.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          headerText="Delete Note"
          shorterText="Are you sure you want to delete this note? This action cannot be undone."
          onClose={() => setShowDeleteModal(false)}
          handleDelete={handleDeleteConfirm}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(90deg, #8E2D8E 0%, #A654CD 100%)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientNotesScreen;
