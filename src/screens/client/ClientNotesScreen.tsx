import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
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
import ScreenHeader from '../../components/layout/ScreenHeader';
import { colors } from '../../theme/colors';
import { NotesIcon } from '../../../assets/svg';

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

  const handleUpdateNote = async (
    noteId: string,
    noteContent: string,
    imageUrl?: string,
  ) => {
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
    <View>
      <ScreenHeader
        title={`${client?.name || 'Client'}'s Notes`}
        subtitle={`${notes.length} ${notes.length === 1 ? 'Note' : 'Notes'}`}
        onBack={() => navigation.goBack()}
      />
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
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <NotesIcon />
        <Text style={styles.addButtonText}>Tap Here to Add Note</Text>
      </TouchableOpacity>

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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.white,
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
    color: colors.black,
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
    backgroundColor: '#F4EAF4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: colors.primary,
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
    color: colors.black,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ClientNotesScreen;
