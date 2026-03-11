import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccounts } from '@hooks/use-accounts';
import {
  AppBottomSheet,
  type AppBottomSheetHandle,
  Button,
  createThemedStyles,
  FormField,
  Text,
  useModalFormStyles,
  useTheme,
} from '@shared/design-system';
import { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, View as RNView } from 'react-native';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  typeIndex: z.number().int().min(0),
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  balance: z.string().refine((v) => v === '' || !isNaN(parseFloat(v)), {
    message: 'Enter a valid number',
  }),
});

type FormValues = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
  { label: 'Card', icon: '💳' },
  { label: 'Cash', icon: '💵' },
  { label: 'Savings', icon: '🏦' },
  { label: 'Credit', icon: '💰' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const AddAccountModal = forwardRef<AppBottomSheetHandle>(
  function AddAccountModal(_props, ref) {
    const styles = useStyles();
    const formStyles = useModalFormStyles();
    const theme = useTheme();

    const { addAccount } = useAccounts();

    const {
      control,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        typeIndex: 0,
        name: ACCOUNT_TYPES[0].label,
        balance: '0',
      },
    });

    const watchedTypeIndex = watch('typeIndex');
    const watchedName = watch('name');

    // Reset form each time the sheet is fully dismissed so stale data
    // never shows when it is opened again.
    const handleDismiss = () => {
      reset();
    };

    const handleTypeSelect = (index: number) => {
      setValue('typeIndex', index, { shouldValidate: false });
      // Pre-fill name only if the current value is still one of the default type labels
      const currentName = watchedName.trim();
      const isStillDefault = ACCOUNT_TYPES.some((t) => t.label === currentName);

      if (!currentName || isStillDefault) {
        setValue('name', ACCOUNT_TYPES[index].label, {
          shouldValidate: false,
        });
      }
    };

    const onValid = async (values: FormValues) => {
      const parsedBalance = parseFloat(values.balance ?? '0') || 0;

      try {
        await addAccount({
          name: values.name.trim(),
          balance: Math.round(parsedBalance * 100),
        });
        reset();
      } catch (err) {
        Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create account');
      }
    };

    return (
      <AppBottomSheet
        ref={ref}
        title="New Account"
        isSubmitting={isSubmitting}
        onDismiss={handleDismiss}
      >
        {/* Account Type */}
        <FormField label="Account Type">
          <RNView style={styles.typeGrid}>
            {ACCOUNT_TYPES.map((type, index) => (
              <Pressable
                key={index}
                onPress={() => handleTypeSelect(index)}
                style={[styles.typeButton, watchedTypeIndex === index && styles.typeButtonActive]}
                accessibilityRole="button"
                accessibilityState={{
                  selected: watchedTypeIndex === index,
                }}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[styles.typeLabel, watchedTypeIndex === index && styles.typeLabelActive]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </RNView>
        </FormField>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Name"
              required
              error={errors.name?.message}
              hint={`${value.length}/100 characters`}
            >
              {/*
               * BottomSheetTextInput registers this input with the sheet's
               * focus tracker so keyboardBehavior="extend" fires correctly.
               */}
              <BottomSheetTextInput
                style={[formStyles.input, !!errors.name && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="e.g., Main Card"
                placeholderTextColor={theme.colors.fg.placeholder}
                maxLength={100}
                autoFocus
                editable={!isSubmitting}
              />
            </FormField>
          )}
        />

        {/* Initial Balance */}
        <Controller
          control={control}
          name="balance"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormField
              label="Initial Balance"
              error={errors.balance?.message}
              hint="Enter the current account balance"
            >
              <RNView style={styles.balanceInputWrapper}>
                {/*
                 * Also use BottomSheetTextInput here so the numeric
                 * keyboard causes the same sheet-extend behavior.
                 */}
                <BottomSheetTextInput
                  style={[formStyles.input, !!errors.balance && styles.inputError]}
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9.-]/g, ''))}
                  onBlur={onBlur}
                  placeholder="0"
                  placeholderTextColor={theme.colors.fg.placeholder}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
                <Text style={styles.currencySymbol}>€</Text>
              </RNView>
            </FormField>
          )}
        />

        {/* Submit */}
        <RNView style={styles.submitButton}>
          <Button
            variant="primary"
            size="lg"
            label="Create"
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onValid)}
          />
        </RNView>
      </AppBottomSheet>
    );
  },
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
    },
    typeButton: {
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      padding: theme.spacing[4],
      borderRadius: theme.radii.md,
      borderWidth: 2,
      borderColor: theme.colors.border.default,
      backgroundColor: theme.colors.bg.sunken,
    },
    typeButtonActive: {
      borderColor: theme.colors.accent.brand,
      backgroundColor: theme.colors.overlay.card,
    },
    typeIcon: {
      fontSize: 32,
      lineHeight: 40,
      marginBottom: theme.spacing[2],
    },
    typeLabel: {
      ...theme.typography.labelSmall,
      color: theme.colors.fg.muted,
    },
    typeLabelActive: {
      color: theme.colors.accent.brand,
    },
    balanceInputWrapper: {
      position: 'relative',
    },
    currencySymbol: {
      position: 'absolute',
      right: theme.spacing[4],
      top: theme.spacing[3],
      ...theme.typography.body,
      color: theme.colors.fg.muted,
    },
    inputError: {
      borderColor: theme.colors.fg.danger,
    },
    submitButton: {
      marginTop: theme.spacing[4],
    },
  }),
);
